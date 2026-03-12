from datetime import date, timedelta
import os
import requests
from decimal import Decimal
from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from dotenv import load_dotenv
from app.models.schemas import OrderResponse
# Import your Enum definition to compare statuses correctly
from app.models.models import OrderStatus 

load_dotenv()

from app.Respository.order_repo import order_repository
from app.models import schemas, models

PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL")

class Order_Service:
    def __init__(self, db: Session):
        self.repo = order_repository(db)

    def create_order(self, user_id: int, order_data: schemas.OrderCreateRequest) -> models.Order:
        # ... (This part was working, keeping it as is) ...
        product_ids = [item.product_id for item in order_data.cart_items]
        if not product_ids:
            raise HTTPException(status_code=400, detail="cart_items cannot be empty.")
        
        try:
            response = requests.get(f"{PRODUCT_SERVICE_URL}/api/get_products/", json={"ids": product_ids}, timeout=10)
            response.raise_for_status()
            products_map = {p['id']: p for p in response.json()}
        except requests.RequestException as e:
            raise HTTPException(status_code=503, detail=f"Product Service is unavailable: {e}")

        order_items_to_create = []
        total_amount = Decimal("0.0")

        for item in order_data.cart_items:
            product_details = products_map.get(item.product_id)
            if not product_details:
                raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found.")
            
            admin_id = product_details.get("admin_id")
            if admin_id is None:
                raise HTTPException(status_code=400, detail=f"Product '{product_details.get('name')}' missing admin_id.")

            price = Decimal(str(product_details.get("price", "0.0")))
            quantity = item.quantity
            
            image_paths = product_details.get('image_path') 
            image_url = image_paths[0] if image_paths else None
            
            order_item = models.OrderItem(
                product_id=item.product_id,
                quantity=quantity,
                price_at_purchase=price,
                product_name=product_details.get('name'),
                image_url=image_url,
                admin_id=admin_id
            )
            order_items_to_create.append(order_item)
            total_amount += quantity * price
        
        billing_addr = order_data.billing_address if order_data.billing_address else order_data.shipping_address

        new_order = models.Order(
            user_id=user_id,
            total_amount=total_amount,
            shipping_address=order_data.shipping_address.dict(),
            billing_address=billing_addr.dict()
        )
        
        return self.repo.create_order_with_items(order=new_order, items=order_items_to_create)

    # ---------------------------------------------------------
    # FIXED: Get Order (Solves "Not authorized" issues)
    # ---------------------------------------------------------
    def get_order(self, order_id: int, user_id: int) -> models.Order:
        order = self.repo.get_order_by_id(order_id=order_id)
        
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")
        
        # FIX: Force conversion to int() to prevent String vs Int mismatch
        # Also allow if the user is an Admin (optional, depending on your logic)
        if int(order.user_id) != int(user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail=f"Not authorized to view order {order_id}."
            )
            
        return order

    # ---------------------------------------------------------
    # FIXED: Cancel Order (Solves status comparison issues)
    # ---------------------------------------------------------
    def cancel_order(self, order_id: int, user_id: int) -> models.Order:
        # 1. Validate ownership using the fixed get_order method
        order = self.get_order(order_id=order_id, user_id=user_id)

        # FIX: Convert Enum to string for comparison to be safe
        # Depending on how SQLAlchemy returns it, it might be an object or a string
        current_status = str(order.status.value) if hasattr(order.status, 'value') else str(order.status)
        
        forbidden_statuses = [
            str(models.OrderStatus.SHIPPED.value), 
            str(models.OrderStatus.DELIVERED.value),
            str(models.OrderStatus.CANCELLED.value)
        ]

        if current_status in forbidden_statuses:
            raise HTTPException(
                status_code=400, 
                detail=f"Cannot cancel order. Current status is {current_status}"
            )

        # 2. Perform Update
        return self.repo.update_order_status(order_id=order_id, new_status=models.OrderStatus.CANCELLED)

    # ---------------------------------------------------------
    # Helper: Get User Orders
    # ---------------------------------------------------------
    def get_user_orders(self, user_id: int) -> List[models.Order]:
        orders = self.repo.get_list_order_by_user(user_id=user_id)
        # Ensure we return what the route expects. 
        # If Route expects Pydantic models, use from_orm. 
        # If Route expects ORM objects, just return `orders`.
        return orders 

    # ---------------------------------------------------------
    # Helper: Admin Update
    # ---------------------------------------------------------
    def update_order_status_by_admin(self, order_id: int, new_status: models.OrderStatus) -> models.Order:
        order = self.repo.get_order_by_id(order_id=order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found.")
        
        return self.repo.update_order_status(order_id=order_id, new_status=new_status)

    def get_orders_by_admin(self, admin_id: int) -> List[models.OrderItem]:
        return self.repo.get_sales_by_admin_id(admin_id=admin_id)
    def get_admin_dashboard_data(self, days: int = 30):
      
        end_date = date.today()
        start_date = end_date - timedelta(days=days - 1)
        
        analytics_data = self.repo.get_daily_sales_analytics(start_date=start_date, end_date=end_date)
        
        return {
            "period_start": start_date,
            "period_end": end_date,
            "analytics": analytics_data
        }