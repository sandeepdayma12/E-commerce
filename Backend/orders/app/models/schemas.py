from pydantic import BaseModel, condecimal,condecimal
from typing import List, Optional
from datetime import datetime,date
from .models import OrderStatus

Money = condecimal(max_digits=10, decimal_places=2)

class Address(BaseModel):
    recipient_name: str
    street: str
    city: str
    postal_code: str
    country: str

    model_config = {
        "from_attributes": True
    }

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

    model_config = {
        "from_attributes": True
    }

class OrderCreateRequest(BaseModel):
    cart_items: List[OrderItemCreate]
    shipping_address: Address
    billing_address: Optional[Address] = None

    model_config = {
        "from_attributes": True
    }

class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    product_name: str
    price_at_purchase: Money

    model_config = {
        "from_attributes": True
    }

class OrderResponse(BaseModel):
    id: int
    user_id: int
    status: OrderStatus
    total_amount:float
    created_at: datetime
    items: List[OrderItemResponse]

    model_config = {
        "from_attributes": True
    }

class SaleItem(BaseModel):
    product_id: int
    quantity: int
    price_per_item: float

    model_config = {
        "from_attributes": True
    }

class VendorSale(BaseModel):
    order_id: int
    customer_id: int
    purchase_date: datetime
    items_sold: List[SaleItem]

    model_config = {
        "from_attributes": True
    }


class DailyAnalyticsData(BaseModel):
    date: date  # The specific day
    total_sales: condecimal(max_digits=12, decimal_places=2)
    total_items_sold: int
    estimated_profit: condecimal(max_digits=12, decimal_places=2)

class AdminDashboardResponse(BaseModel):
    period_start: date
    period_end: date
    analytics: List[DailyAnalyticsData]