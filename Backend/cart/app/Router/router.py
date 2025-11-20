from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.models.db import get_db
from app.models.schemas import CartResponse, CartItemCreate, CartItemUpdate
from app.service.cart_service import Cart_Service
from app.utils.jwt import get_current_user_id

router = APIRouter(
    prefix="/cart",
    tags=["Shopping Cart"]
)

@router.get("/", response_model=CartResponse)
def get_current_user_cart(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    svc = Cart_Service(db)
    cart = svc.create_cart(user_id=current_user_id)
    return cart

@router.post("/items", response_model=CartResponse)
def add_item_to_cart(
    item_data: CartItemCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    svc = Cart_Service(db)
    updated_cart = svc.add_item_to_cart(
        user_id=current_user_id,
        product_id=item_data.product_id,
        quantity=item_data.quantity
    )
    return updated_cart

@router.put("/items/{product_id}", response_model=CartResponse)
def update_item_quantity(
    product_id: int,
    item_data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    svc = Cart_Service(db)
    cart = svc.create_cart(user_id=current_user_id)
    updated_cart = svc.update_item_to_quantity(
        product_id=product_id,
        quantity=item_data.quantity,
        cart=cart
    )
    return updated_cart

@router.delete("/items/{product_id}", response_model=CartResponse)
def delete_item_from_cart(
    product_id: int,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    svc = Cart_Service(db)
    cart = svc.create_cart(user_id=current_user_id)
    updated_cart = svc.delete_item_to_cart(
        cart=cart,
        product_id=product_id
    )
    return updated_cart

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def clear_entire_cart(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    svc = Cart_Service(db)
    cart = svc.create_cart(user_id=current_user_id)
    svc.clear_cart(cart)
    return None
