from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

# ====================================================================
# This schema defines the structure for a single item within the cart.
# ====================================================================
class CartItem(BaseModel):
    """
    Represents a single item in the shopping cart response.
    """
    product_id: int = Field(..., description="The unique identifier for the product, from the Product Service.")
    quantity: int = Field(..., gt=0, description="The quantity of the product in the cart. Must be greater than 0.")

    class Config:
        # This allows the Pydantic model to be created from an ORM object (like your SQLAlchemy CartItem)
        orm_mode = True


# ====================================================================
# This is the main schema for the entire shopping cart response.
# ====================================================================
class Cart(BaseModel):
    """
    Represents the full shopping cart for a user.
    This is the main object returned by most cart API endpoints.
    """
    id: int = Field(..., description="The unique identifier for the cart itself.")
    user_id: str = Field(..., description="The unique identifier for the user who owns this cart.")
    updated_at: datetime = Field(..., description="The timestamp when the cart was last updated.")
    
    # This is where the magic happens: it's a list containing CartItem objects.
    items: List[CartItem] = []

    class Config:
        orm_mode = True