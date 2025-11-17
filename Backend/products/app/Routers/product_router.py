from fastapi import APIRouter, Depends, HTTPException, status,Body
from sqlalchemy.orm import Session
from app.models.db import get_db
from app.Services.product_service import ProductService
from app.models.schemas import ProductResponse,ProductBase, ProductCreate, ProductUpdate
from fastapi import UploadFile,File
from typing import List
from app.Repositories.products_repo import ProductRepo
import app.Services.ai_service as ai_service        
product_router=APIRouter()
def get_product_repo(db: Session = Depends(get_db)):
    return ProductRepo(db)
@product_router.post("/", response_model=ProductResponse)
def create_product(
    payload: ProductCreate = Depends(),
    images: List[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    svc = ProductService(db)
    result = svc.create(payload.dict(), images)
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
@product_router.get("api/product/get/{id}")
def get_product(id: int, db: Session = Depends(get_db)):
    svc=ProductService(db)
    result=svc.get_product(id)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result
@product_router.put("/api/update_product/{id}", response_model=ProductUpdate)
def update_product(
    id: int,
    payload: ProductUpdate = Depends(),
    images: List[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    svc = ProductService(db)
    result = svc.update(id, payload.dict(), images)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@product_router.post("/ai-search/")
def ai_product_search(
    query: str = Body(..., embed=True),
    repo: ProductRepo = Depends(get_product_repo)
):
    """
    Accepts a natural language query, uses GenAI to parse it,
    and returns matching products.
    """
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    try:
        # 1. Call the AI service to get structured criteria
        search_criteria = ai_service.parse_shopping_query(user_query=query)

        # 2. Use the repository to search the database
        products = repo.search_products(
            category=search_criteria.get("category"),
            tags=search_criteria.get("tags")
        )
        
        return products
        
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {str(e)}")

