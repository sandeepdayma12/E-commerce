from app.service.cart_service import Cart_Service
from app.models.schemas import Cart,CartItem
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models.db import get_db
router = APIRouter()
@router.get("/{id}",response_model=Cart)
def get_my_cart(id:int , db:Session=Depends(get_db)):
    svc=Cart_Service(db)
    result=svc.create_cart(id)
    if not result:
        return{"message":"user not found"}
    return result

