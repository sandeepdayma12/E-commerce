from fastapi import FastAPI
from app.Router.router import router
from fastapi.middleware.cors import CORSMiddleware
from .database_utils import create_order_db_if_not_exists
from app.models.database import Base, engine
import os

# --- IMPORTANT: IMPORT YOUR MODELS HERE ---
# Even if you don't use the 'models' variable, this line 
# forces Python to load the class definitions so SQLAlchemy "sees" them.

# ------------------------------------------

# 1. Ensure the DB exists
create_order_db_if_not_exists()

# 2. Create the tables (Now it will see the 'orders' table)
Base.metadata.create_all(bind=engine)

app = FastAPI()

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
def root():
    return {"status": "Order Service is running"}