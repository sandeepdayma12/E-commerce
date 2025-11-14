from sqlalchemy import String, Integer, ForeignKey, Column, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.database import Base

class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True)
    # The user_id should not be nullable and should have a length
    user_id = Column(String(36), unique=True, index=True, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    
    # This cascade will automatically delete items when the cart is deleted
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

# RENAMED to CartItem for standard Python naming conventions
class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True)
    
    # CORRECTED ForeignKey syntax to use a string
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False)
    
    # REMOVED unique=True, which was the critical logical flaw
    product_id = Column(Integer, index=True, nullable=False)
    
    quantity = Column(Integer, nullable=False)
    
    cart = relationship("Cart", back_populates="items")