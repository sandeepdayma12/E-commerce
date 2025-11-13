from sqlalchemy import String, Integer, ForeignKey, Column, Boolean, JSON
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
    price = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    description = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id")) 
    is_active = Column(Boolean, default=True)
    image_path=Column(JSON,nullable=True)

    
    category = relationship("Category", back_populates="products")
