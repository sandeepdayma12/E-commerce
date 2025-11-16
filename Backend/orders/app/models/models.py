import enum
from datetime import datetime
from typing import List, Optional

from sqlalchemy import (
    create_engine,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Enum,
    JSON,
)
from sqlalchemy.orm import declarative_base, relationship

# Define the declarative base
Base = declarative_base()


# --- Enum Definition ---
class OrderStatus(enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"
    RETURNED = "RETURNED"


# --- Table Models using Column ---
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    user_id = Column(String(36), index=True, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    shipping_method = Column(String(50), nullable=True)
    tracking_number = Column(String(100), nullable=True)
    shipping_address = Column(JSON, nullable=False)
    billing_address = Column(JSON, nullable=False)
    payment_details = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # The relationship definition remains the same
    order_items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(String(36), index=True, nullable=False)
    product_name = Column(String(200), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String(255), nullable=True)

    # The relationship definition remains the same
    order = relationship("Order", back_populates="order_items")