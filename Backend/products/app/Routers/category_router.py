from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models.db import get_db
from app.Services.cat_service import CategoryService
from app.models.schemas import CategoryCreate, CategoryResponse,Categoryupdate

category_router = APIRouter()
@category_router.post("/api/create_category", response_model=CategoryResponse)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    svc = CategoryService(db)
    result = svc.create(payload.dict())
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=result["error"]
        )
    return result
@category_router.get("/api/get_categories/",response_model=List[CategoryResponse])
def get_categories(db:Session=Depends(get_db)):
    svc=CategoryService(db)
    result=svc.list_product()
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=result["error"]
        )
    return result
@category_router.get("/api/get_category/{id}", response_model=CategoryResponse)
def get_category(id:int, db:Session=Depends(get_db)):
    svc=CategoryService(db)
    result=svc.get_product(id)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=result["error"]
        )
    return result
@category_router.delete("/api/delete_category/{id}")
def delete_category(id:int, db:Session=Depends(get_db)):
    svc=CategoryService(db)
    result=svc.delete(id)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=result["error"]
        )
    return {"message":f"product is delete for the {id}"}
@category_router.put("/api/update_category/{id}",response_model=Categoryupdate)
def update_product(id:int,
                   payload:Categoryupdate,
                   db:Session=Depends(get_db)):
    svc=CategoryService(db)
    result=svc.update(id,payload.dict())
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=result["error"]
        )
    return result



