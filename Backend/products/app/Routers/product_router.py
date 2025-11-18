from fastapi import APIRouter, Depends, HTTPException, status,Form
from sqlalchemy.orm import Session
from app.models.db import get_db
from app.Services.product_service import ProductService
from app.models.schemas import ProductResponse,ProductBase, ProductCreate, ProductUpdate
from fastapi import UploadFile,File
from typing import List
from app.Repositories.products_repo import ProductRepo
product_router=APIRouter()
@product_router.post("/api/create_product/", response_model=ProductResponse)
def create_product(
    name: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    description: str = Form(...),
    category_id: int = Form(...),
    images: List[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    payload = {
        "name": name,
        "price": price,
        "quantity": quantity,
        "description": description,
        "category_id": category_id
    }

    svc = ProductService(db)
    result = svc.create(payload, images)

    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result
@product_router.get('/api/get_products/',response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    svc=ProductService(db)
    product=svc.list_product()
    if isinstance(product, dict) and "error" in  product:
        raise HTTPException(status_code=400, detail=product["error"])
    return product
@product_router.delete("/api/delete_product/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    svc = ProductService(db)
    result = svc.delete(id)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    # return a simple confirmation or the service result if it provides more info
    return {"detail": "product deleted"} if result is None else result
@product_router.get("/api/product/get/{id}")
def get_product(id: int, db: Session = Depends(get_db)):
    svc=ProductService(db)
    result=svc.get_product(id)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@product_router.put("/api/update_product/{id}")
def update_product(
    id: int,
    name: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    description: str = Form(...),
    category_id: int = Form(...),
    is_active: bool = Form(...),
    images: List[UploadFile] = File(None),
    db: Session = Depends(get_db)
):

    payload = {
        "name": name,
        "price": price,
        "quantity": quantity,
        "description": description,
        "category_id": category_id,
        "is_active": is_active
    }

    svc = ProductService(db)
    result = svc.update(id, payload, images)

    if not result:
        raise HTTPException(status_code=404, detail="Product not found")

    return {"message": "Product Updated", "data": result}



