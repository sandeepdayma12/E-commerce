import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.Router.router import router
from app.models.db import Base, engine

load_dotenv()

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
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

@app.get("/", tags=["Health Check"])
def read_root():
    return {"status": "Cart Service is running"}
