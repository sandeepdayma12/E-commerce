from sqlalchemy import String, Integer, Column, Float, DateTime
from sqlalchemy.sql import func
from app.models.database import Base

class Payment(Base):
    __tablename__ = "payment"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, unique=True, index=True)
    
    # --- THIS IS THE CRITICAL NEW FIELD ---
    stripe_payment_intent_id = Column(String, unique=True, index=True, nullable=True)

    stripe_charge_id = Column(String, unique=True, index=True, nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False, default="usd")
    status = Column(String, nullable=False, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())