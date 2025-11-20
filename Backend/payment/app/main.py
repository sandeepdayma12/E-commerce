# In your main.py file

from fastapi import FastAPI
from dotenv import load_dotenv

# Import your router
# CORRECT WAY
from app.routers.router import router as payment_router

# Load environment variables from .env file
load_dotenv()

# ... other setup like creating database tables ...

app = FastAPI(
    title="Payment Service",
    version="1.0.0"
)

# Include the payment router with a prefix
# All routes in router.py will now start with /payments
app.include_router(payment_router, prefix="/payments", tags=["Payments"])

@app.get("/health")
def health_check():
    return {"status": "ok"}