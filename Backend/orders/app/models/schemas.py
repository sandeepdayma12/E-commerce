from pydantic import BaseModel
from typing import List
from datetime import datetime
from app.models.models.models import OrderStatus # Import the enum from your models

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class Address(BaseModel):
    recipient_name: str
    street: str
    city: str
    postal_code: str
    country: str

class OrderCreateRequest(BaseModel):
    cart_items: List[OrderItemCreate]
    shipping_address: Address

# --- Response Schemas ---
class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    product_name: str
    price_at_purchase: float

    class Config:
        orm_mode = True

class OrderResponse(BaseModel):
    id: int
    user_id: str
    status: OrderStatus
    total_amount: float
    shipping_address: Address
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        orm_mode = True