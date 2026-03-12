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
class Categoryupdate(CategoryBase):
    category:Optional[str]=None
    description:Optional[str]=None

class ProductBase(BaseModel):
    name: str
    price: int
    quantity: int
    description: str
    category_id: int
    is_active: bool = True



class ProductCreate(BaseModel):
    name: str
    price: int
    quantity: int
    description: str
    category_id: int
    is_active: bool = True
    admin_id: int      # <-- FIXED
    image_path: Optional[List[str]]  # Optional list of image paths


class ProductUpdate(BaseModel):
    name: Optional[str]
    price: Optional[int]
    quantity: Optional[int]
    description: Optional[str]
    category_id: Optional[int]
    is_active: Optional[bool]
    image_path: Optional[List[str]]
    admin_id: Optional[int]    # optional for update


class ProductResponse(ProductBase):
    id: int
    admin_id: int
    image_path: Optional[List[str]]

    class Config:
        orm_mode = True

