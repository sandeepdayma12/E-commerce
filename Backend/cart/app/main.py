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

app = FastAPI(
    title="E-commerce Cart Service",
)

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/", tags=["Health Check"])
def read_root():
    return {"status": "Cart Service is running"}
