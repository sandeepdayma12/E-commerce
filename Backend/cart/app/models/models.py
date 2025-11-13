from sqlalchemy import String , Integer, ForeignKey,Column,Boolean  ,DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.database import Base
class Cart(Base):
    __tablename__="carts"
    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,unique=True,index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    items = relationship("CartItem", back_populates="cart")
class Cart_Items(Base):
    __tablename__="cart_items"
    id=Column(Integer,primary_key=True,index=True)
    cart_id=Column(Integer, ForeignKey(Cart.id),index=True)
    product_id=Column(Integer,unique=True,index=True)
    quantity=Column(Integer, nullable=False)
    cart = relationship("Cart", back_populates="items")
   