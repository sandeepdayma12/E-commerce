import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database_utils import create_database_if_not_exists
from app.Router.router import router
from app.models.db import Base, engine
create_database_if_not_exists()
Base.metadata.create_all(bind=engine)


load_dotenv()

print("Creating database tables...")

print("Database tables created successfully.")

app = FastAPI(
    title="E-commerce Cart Service",
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
# router = APIRouter(prefix="/cart")
Base.metadata.create_all(bind=engine)



@app.get("/", tags=["Health Check"])
def read_root():
    return {"status": "Cart Service is running"}
