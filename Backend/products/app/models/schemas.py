from pydantic import BaseModel,validator
from typing import Optional
from typing import List

class CategoryBase(BaseModel):
    category: str
    description: str


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int

    class Config:
        orm_mode = True

class ProductBase(BaseModel):
    name: str
    price: int
    quantity: int
    description: str
    category_id: Optional[int] 
    image_path:List[str]
    @validator('image_path', pre=True)
    def parse_image_path(cls, v):
        import json
        if isinstance(v, str):
            return json.loads(v)
        return v

    class Config:
        orm_mode = True


class ProductCreate(ProductBase):
    pass


class Categoryupdate(CategoryBase):
    category:Optional[str]=None
    description:Optional[str]=None


class ProductResponse(ProductBase):
    id: int
    is_active: bool
    category: CategoryBase = None

    class Config:
        orm_mode = True
class ProductUpdate(ProductBase):
    """Schema for updating an existing product"""
    name: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    image_path: Optional[List[str]] = None
    is_active: Optional[bool] = None