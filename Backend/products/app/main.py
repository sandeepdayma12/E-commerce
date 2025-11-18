import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.Routers.product_router import product_router
from app.Routers.category_router import category_router
from app.models.database import Base, engine

# Path to: /Backend/products/static
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # /products/app
STATIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "static"))


print("STATIC_DIR =", STATIC_DIR)  # Debug print

Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-Commerce Product Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router)
app.include_router(category_router, prefix="/categories", tags=["Categories"])

# Mount static folder correctly
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
def root():
    return {"message": "Product Service is running"}
