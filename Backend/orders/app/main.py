from fastapi import FastAPI
from app.Router.router import router
from fastapi.middleware.cors import CORSMiddleware
from .database_utils import create_order_db_if_not_exists
from app.models.database import Base, engine

# --- IMPORTANT: IMPORT YOUR MODELS HERE ---
# Even if you don't use the 'models' variable, this line 
# forces Python to load the class definitions so SQLAlchemy "sees" them.

# ------------------------------------------

# 1. Ensure the DB exists
create_order_db_if_not_exists()

# 2. Create the tables (Now it will see the 'orders' table)
print("🏗️  Order Service: Syncing tables...")
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)