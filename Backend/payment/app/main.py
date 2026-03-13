from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .database_utils import create_payment_db_if_not_exists
load_dotenv()

from app.models.db import engine, Base
from app.routers.router import router as payment_router
create_payment_db_if_not_exists()
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Payment Service",
    description="A service to handle payments with Stripe.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payment_router, prefix="/payments", tags=["Payments"])

@app.on_event("startup")
def validate_stripe_key():
    import os
    stripe_key = os.getenv("STRIPE_SECRET_KEY", "")
    if not stripe_key:
        print("WARNING: STRIPE_SECRET_KEY is not set. Payment intents will fail.")
    elif stripe_key.startswith("pk_"):
        print("WARNING: STRIPE_SECRET_KEY is a publishable key (pk_*). Use a secret key (sk_*).")

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
