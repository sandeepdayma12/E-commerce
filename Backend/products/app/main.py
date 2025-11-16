from fastapi import FastAPI
from app.Routers.product_router import product_router
from app.Routers.category_router import category_router
from app.models.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-Commerce Product Service")

app.include_router(product_router)
app.include_router(category_router, prefix="/categories", tags=["Categories"])

@app.get("/")
def root():
    return {"message": "Product Service is running"}
