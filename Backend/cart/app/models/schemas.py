from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

# ====================================================================
# Schemas for API Responses (Data sent FROM the server)
# ====================================================================

class CartItemResponse(BaseModel):
    """
    Defines the structure for a single item within a cart response.
    """
    product_id: int = Field(..., description="The unique identifier for the product.")
    quantity: int = Field(..., description="The quantity of this product in the cart.")

    class Config:
        # This is CRITICAL. It allows Pydantic to create this schema
        # from your SQLAlchemy model object automatically.
        orm_mode = True


class CartResponse(BaseModel):
    """
    Defines the structure for the entire shopping cart object returned by the API.
    This is used as the `response_model` in your endpoints.
    """
    id: int = Field(..., description="The unique ID of the cart.")
    user_id: str = Field(..., description="The ID of the user who owns the cart.")
    updated_at: datetime = Field(..., description="The timestamp of the last update.")
    
    # A list where each element must match the CartItemResponse schema
    items: List[CartItemResponse] = []

    class Config:
        orm_mode = True


# ====================================================================
# Schemas for API Requests (Data sent TO the server)
# ====================================================================

class CartItemCreate(BaseModel):
    """
    Defines the request body for the POST /add-item endpoint.
    """
    product_id: int = Field(..., description="The ID of the product to add.")
    quantity: int = Field(..., gt=0, description="The quantity to add. Must be greater than 0.")


class CartItemUpdate(BaseModel):
    """
    Defines the request body for the PUT /update-item/{product_id} endpoint.
    """
    quantity: int = Field(..., gt=0, description="The new quantity for the item. Must be greater than 0.")