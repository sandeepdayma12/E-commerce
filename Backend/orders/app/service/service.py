import os
import requests
from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

# --- Project Imports ---

# The Repository for database access
from app.Respository.order_repo import order_repository

# SQLAlchemy Models and the Status Enum
from app.models.models import Order, OrderItem, OrderStatus

# Pydantic Schemas for data validation
from app.models.schemas import OrderCreateRequest 


# --- Configuration ---

# Get the Product Service URL from your .env file
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL")


# ====================================================================
# The Service Class
# ====================================================================

class Order_Service:
    def __init__(self, db: Session):
        self.repo = order_repository(db)
        self.db = db

    def create_order(self, user_id: str, order_data) -> Order:
        """
        Robust create_order:
         - reads cart_items from order_data
         - fetches product snapshot from product service
         - validates presence of shipping/billing/payment
         - creates Order first, then OrderItems
        """

        # --- 0. Defensive reads for fields (avoid AttributeError) ---
        # support both pydantic attributes and dict-style payloads
        data_dict = getattr(order_data, "dict", lambda: {})()
        if callable(data_dict):
            data_dict = order_data.dict()
        # fallback: if above fails, try __dict__
        if not isinstance(data_dict, dict):
            data_dict = getattr(order_data, "__dict__", {}) or {}

        cart_items = data_dict.get("cart_items") or data_dict.get("items") or []
        # normalize list of simple dicts -> pydantic objects assumed earlier, so handle both
        if cart_items is None:
            cart_items = []

        # Ensure there is at least one cart item
        if not isinstance(cart_items, list) or len(cart_items) == 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="cart_items is required and must be a non-empty list.")

        # shipping / billing / payment retrieval (defensive)
        shipping_address = data_dict.get("shipping_address") or data_dict.get("shipping") or None
        billing_address = data_dict.get("billing_address") or data_dict.get("billing") or None
    
        shipping_method = data_dict.get("shipping_method") or data_dict.get("shippingMethod") or None

        # if billing missing, fallback to shipping (common pattern)
        if billing_address is None and shipping_address is not None:
            billing_address = shipping_address

        # Validate required addresses/payment
        if shipping_address is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="shipping_address is required.")
        if billing_address is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="billing_address is required (or provide shipping_address to fallback).")


        # --- 1. Inter-Service: fetch products snapshot ---
        product_ids = [ci.get("product_id") if isinstance(ci, dict) else getattr(ci, "product_id", None)
                       for ci in cart_items]
        # filter None
        product_ids = [pid for pid in product_ids if pid]

        try:
            # Note: GET with JSON body is non-standard; many servers ignore body for GET.
            # Prefer POST or pass ids as query param. We'll try POST if GET fails often.
            response = requests.get(
                f"{PRODUCT_SERVICE_URL}/api/get_products/",
                json={"ids": product_ids},
                timeout=5
            )
            response.raise_for_status()
            products = response.json()
            product_details_map = {str(p["id"]): p for p in products}
        except requests.RequestException as e:
            # try fallback GET (query param) before failing
            try:
                q = ",".join(product_ids)
                response = requests.get(f"{PRODUCT_SERVICE_URL}/api/get_products/?ids={q}", timeout=5)
                response.raise_for_status()
                products = response.json()
                product_details_map = {str(p["id"]): p for p in products}
            except requests.RequestException:
                raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                                    detail=f"Product Service is unavailable: {e}")

        # --- 2. Build OrderItem instances + total ---
        order_items_list = []
        total_amount = 0.0

        for ci in cart_items:
            # support dict or pydantic-like object
            pid = ci.get("product_id") if isinstance(ci, dict) else getattr(ci, "product_id", None)
            qty = ci.get("quantity") if isinstance(ci, dict) else getattr(ci, "quantity", None)

            if pid is None or qty is None:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                    detail="Each cart item must have product_id and quantity.")

            product = product_details_map.get(str(pid))
            if not product:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                    detail=f"Product with id {pid} not found.")

            price = float(product.get("price", 0.0))
            name = product.get("name", "") or (ci.get("product_name") if isinstance(ci, dict) else getattr(ci, "product_name", ""))

            oi = OrderItem(
                product_id=str(pid),
                product_name=name,
                quantity=int(qty),
                price_at_purchase=price,
                image_url=product.get("image_url")
            )
            order_items_list.append(oi)
            total_amount += int(qty) * price

        # --- 3. Create Order WITHOUT passing 'items' keyword ---
        new_order = Order(
            user_id=user_id,
            total_amount=total_amount,
            shipping_address=shipping_address,
            billing_address=billing_address,
            shipping_method=shipping_method
        )

        # Persist order first
        self.db.add(new_order)
        self.db.commit()
        self.db.refresh(new_order)

        # --- 4. Attach order items (set order_id) ---
        for oi in order_items_list:
            oi.order_id = new_order.id
            self.db.add(oi)

        self.db.commit()
        self.db.refresh(new_order)

        return new_order
    def get_order(self, order_id: int, user_id: str) -> Order:
        """
        Gets a single order, ensuring the user is authorized to view it.
        """
        order = self.repo.get_order_by_id(order_id=order_id)
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")
        
        # Security check: Make sure the user is not trying to access someone else's order
        if order.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this order.")
            
        return order

    def get_user_orders(self, user_id: str) -> List[Order]:
        """
        Gets a list of all orders for a specific user.
        """
        return self.repo.get_list_order_by_user(user_id=user_id)

    def cancel_order(self, order_id: int, user_id: str) -> Order:
        """
        Cancels an order, with business logic to prevent cancellation of shipped orders.
        """
        order = self.get_order(order_id=order_id, user_id=user_id) # Reuse get_order for validation
        
        # --- Business Logic ---
        if order.status in [OrderStatus.SHIPPED, OrderStatus.DELIVERED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot cancel an order that has already been shipped."
            )
            
        order.status = OrderStatus.CANCELLED
        
        # The repository method is generic; the service provides the specific logic
        return self.repo.update_order_status(order=order)
        
    # You would have other methods here, for example, for an admin to update status
    def update_order_status_by_admin(self, order_id: int, new_status: OrderStatus) -> Order:
        """
        Allows an admin to update the status of any order.
        """
        order = self.repo.get_order_by_id(order_id=order_id)
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")
        
        order.status = new_status
        return self.repo.update_order_status(order=order)