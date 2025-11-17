# app/routes/order_routes.py

from app.models.db import get_db
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.service.service import Order_Service
from app.models.schemas import OrderCreateRequest, OrderResponse

from app.models.models import OrderStatus
# ⬇️ Your custom dependency: returns only user_id
from app.utils.jwt import get_current_user_id


router = APIRouter(prefix="/orders", tags=["Orders"])


# --- Dependency Injector ---
def get_order_service(db: Session = Depends(get_db)):
    return Order_Service(db)


# =====================================================================
# 1. CREATE ORDER
# =====================================================================
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreateRequest,
    user_id: str = Depends(get_current_user_id),
    service: Order_Service = Depends(get_order_service),
):
    return service.create_order(user_id=user_id, order_data=order_data)


# =====================================================================
# 2. GET SINGLE ORDER
# =====================================================================
@router.get("/{order_id}")
def get_order(
    order_id: int,
    user_id: str = Depends(get_current_user_id),
    service: Order_Service = Depends(get_order_service),
):
    return service.get_order(order_id=order_id, user_id=user_id)


# =====================================================================
# 3. GET ALL USER ORDERS
# =====================================================================
@router.get("/")
def get_user_orders(
    user_id: str = Depends(get_current_user_id),
    service: Order_Service = Depends(get_order_service),
):
    return service.get_user_orders(user_id=user_id)


# =====================================================================
# 4. CANCEL ORDER
# =====================================================================
@router.patch("/{order_id}/cancel")
def cancel_order(
    order_id: int,
    user_id: str = Depends(get_current_user_id),
    service: Order_Service = Depends(get_order_service),
):
    return service.cancel_order(order_id=order_id, user_id=user_id)


# =====================================================================
# 5. ADMIN: UPDATE ORDER STATUS
# =====================================================================
@router.patch("/{order_id}/update-status")
def update_order_status_by_admin(
    order_id: int,
    new_status: OrderStatus,
    service: Order_Service = Depends(get_order_service),
):
    return service.update_order_status_by_admin(order_id=order_id, new_status=new_status)
