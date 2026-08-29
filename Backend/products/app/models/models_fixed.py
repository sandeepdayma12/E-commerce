from sqlalchemy import String, Integer, Float, ForeignKey, Column, Boolean, JSON, DateTime, func
from sqlalchemy.schema import UniqueConstraint
from sqlalchemy.orm import relationship
from app.models.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False, index=True)
    description = Column(String, nullable=False, index=True)
    
    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    description = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id")) 
    is_active = Column(Boolean, default=True)
    image_path = Column(JSON, nullable=True)
    admin_id = Column(Integer, index=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        UniqueConstraint("name", "category_id", name="unique_product_per_category"),
    )

    category = relationship("Category", back_populates="products")
