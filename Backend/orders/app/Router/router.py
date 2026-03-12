
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.service.service import Order_Service
from app.models.schemas import OrderCreateRequest, OrderResponse, VendorSale, SaleItem, AdminDashboardResponse
from app.models.models import OrderStatus
from app.utils.jwt import get_current_user_id, get_current_admin_id
from app.models.db import get_db

router = APIRouter(prefix="/orders", tags=["Orders"])

def get_order_service(db: Session = Depends(get_db)):
    return Order_Service(db)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=OrderResponse)
def create_order(
    order_data: OrderCreateRequest,
    user_id: int = Depends(get_current_user_id),
    service: Order_Service = Depends(get_order_service),
):
    return service.create_order(user_id=user_id, order_data=order_data)

@router.get("/", response_model=List[OrderResponse])
def get_user_orders(
    user_id: int = Depends(get_current_user_id),
    service: Order_Service = Depends(get_order_service),
):
    return service.get_user_orders(user_id=user_id)

@router.get("/sales/me", response_model=List[VendorSale])
def get_my_sales(
    admin_id: int = Depends(get_current_admin_id),
    service: Order_Service = Depends(get_order_service)
):
    sales_items = service.get_orders_by_admin(admin_id=admin_id)
    
    sales_by_order = {}
    for item in sales_items:
        order_id = item.order_id
        if order_id not in sales_by_order:
            sales_by_order[order_id] = {
                "order_id": order_id,
                "customer_id": item.order.user_id,
                "purchase_date": item.order.created_at,
                "items_sold": []
            }
        
        sale_item_data = {
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price_per_item": item.price_at_purchase
        }
        sales_by_order[order_id]["items_sold"].append(sale_item_data)

    return list(sales_by_order.values())

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    user_id: int = Depends(get_current_user_id),
    service: Order_Service = Depends(get_order_service),
):
    return service.get_order(order_id=order_id, user_id=user_id)

@router.patch("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(
    order_id: int,
    user_id: int = Depends(get_current_user_id),
    service: Order_Service = Depends(get_order_service),
):
    return service.cancel_order(order_id=order_id, user_id=user_id)

@router.patch("/{order_id}/update-status", response_model=OrderResponse)
def update_order_status_by_admin(
    order_id: int,
    new_status: OrderStatus,
    admin_id: int = Depends(get_current_admin_id),
    service: Order_Service = Depends(get_order_service),
):
    return service.update_order_status_by_admin(order_id=order_id, new_status=new_status)
@router.get(
    "/admin/dashboard/analytics",
    response_model=AdminDashboardResponse,
    summary="[ADMIN] Get data for sales/profit graphs"
)
def get_admin_dashboard(
    days: int = Query(default=30, ge=1, le=365),  # Add validation for the 'days' parameter # Protects the route
    service: Order_Service = Depends(get_order_service),
):
    return service.get_admin_dashboard_data(days=days)