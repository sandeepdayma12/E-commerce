
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List

from app.service.service import SearchService
from app.models.schemas import ProductSearchResult,SearchResponse
from app.models.database import engine
from app.models.db import get_db
app = FastAPI()

@app.get("/search", response_model=SearchResponse)
def search_products(q: str, db: Session = Depends(get_db)):

    service = SearchService(db)
    results = service.perform_search(q)
    
    return {
        "query": q,
        "results": results 
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}