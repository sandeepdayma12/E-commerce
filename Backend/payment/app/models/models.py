from sqlalchemy import String, Integer, ForeignKey, Column, Boolean, JSON,Float,DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.database import Base


class Payment(Base):
    __tablename__ = "payment"

    id = Column(Integer, primary_key=True, index=True)
    order_id=Column(Integer, unique=True, index=True)
    stripe_charge_id=Column(String, unique=True, index=True)
    amount=Column(Float,nullable=False)
    currency=Column(String, nullable=False,default="usd")
    status=Column(String, nullable=False, default="pending")
    created_at=Column(DateTime(timezone=True),server_default=func.now())

    
   