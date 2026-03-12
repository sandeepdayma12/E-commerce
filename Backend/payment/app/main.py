from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .database_utils import create_payment_db_if_not_exists
load_dotenv()

from app.models.database import engine, Base
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

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}