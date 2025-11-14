from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

# --- Project Imports ---

# Database dependency
from app.models.db import get_db

# Pydantic Schemas for request bodies and responses
from app.models.schemas import CartResponse, CartItemCreate, CartItemUpdate

# The Service Layer that contains all business logic
from app.service.cart_service import Cart_Service

# The security dependency to get the authenticated user's ID
from app.utils.jwt import get_current_user_id


# --- API Router Setup ---

router = APIRouter(
    prefix="/cart",
    tags=["Shopping Cart"]
)


# ====================================================================
# API ENDPOINTS
# ====================================================================

@router.get("/", response_model=CartResponse)
def get_current_user_cart(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Retrieves the shopping cart for the currently authenticated user.
    If a cart does not exist for the user, a new one will be created.
    """
    svc = Cart_Service(db)
    # Your service's create_cart method now correctly gets or creates the cart
    cart = svc.create_cart(user_id=current_user_id)
    return cart


@router.post("/items", response_model=CartResponse)
def add_item_to_cart(
    item_data: CartItemCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Adds a new item to the user's cart or increases its quantity if it already exists.
    """
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
    item_data: CartItemUpdate, # Request body contains the new quantity
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Updates the quantity of a specific item in the user's cart.
    """
    svc = Cart_Service(db)
    # First, get the user's cart object
    cart = svc.create_cart(user_id=current_user_id)
    
    # Then, call the update method, which expects the full cart object
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
    """
    Deletes a specific item from the user's cart.
    """
    svc = Cart_Service(db)
    # First, get the user's cart object
    cart = svc.create_cart(user_id=current_user_id)
    
    # Then, call the delete method
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
    """
    Deletes all items from the user's cart.
    """
    svc = Cart_Service(db)
    # First, get the user's cart object
    cart = svc.create_cart(user_id=current_user_id)
    
    # Then, call the clear method
    svc.clear_cart(cart)
    
    # A 204 response must not have a body, so we return None
    return None