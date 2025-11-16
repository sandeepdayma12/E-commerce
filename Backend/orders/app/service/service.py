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

    def create_order(self, user_id: str, order_data: OrderCreateRequest) -> Order:
        """
        Orchestrates the creation of a new order.
        1. Calls the Product Service to get authoritative product details.
        2. Calculates the total amount.
        3. Creates the Order and OrderItem objects.
        4. Calls the repository to save them to the database.
        """
        product_ids = [item.product_id for item in order_data.cart_items]
        
        # --- 1. Inter-Service Communication ---
        try:
            response = requests.post(
                f"{PRODUCT_SERVICE_URL}/api/v1/products/batch-details",
                json={"ids": product_ids}
            )
            response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
            product_details_map = {p["id"]: p for p in response.json()}
        except requests.RequestException as e:
            # This handles network errors or if the Product Service is down
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Product Service is unavailable: {e}")

        # --- 2. Business Logic: Calculation and Snapshotting ---
        order_items_to_create = []
        total_amount = 0
        
        for item in order_data.cart_items:
            product = product_details_map.get(item.product_id)
            if not product:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product with id {item.product_id} not found.")
            
            # Create OrderItem objects with snapshotted data
            order_item = OrderItem(
                product_id=item.product_id,
                quantity=item.quantity,
                product_name=product["name"],
                price_at_purchase=float(product["price"])
            )
            order_items_to_create.append(order_item)
            total_amount += item.quantity * float(product["price"])
            
        # --- 3. Prepare the main Order object ---
        new_order = Order(
            user_id=user_id,
            total_amount=total_amount,
            shipping_address=order_data.shipping_address.dict(),
            items=order_items_to_create  # SQLAlchemy will handle creating the items
        )
        
        # --- 4. Call the repository to save to the database ---
        return self.repo.create_order(order=new_order)

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