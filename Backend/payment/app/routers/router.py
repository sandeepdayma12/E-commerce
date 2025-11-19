import os
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.services.service import PaymentService
from app.models.schemas import Paymentintentcreate, Paymentintentresponse
from app.models.db import get_db
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")


@router.post(
    "/create-payment-intent",
    response_model=Paymentintentresponse,
    summary="Create a Stripe Payment Intent",
    description="Initiates a payment process by creating a record in the database and a Payment Intent with Stripe."
)
def create_payment_intent_endpoint(
    payment_data: Paymentintentcreate,
    db: Session = Depends(get_db)
):
    try:
        service = PaymentService(db)
        return service.create_payment_intent(payment_data)

    except stripe.errors.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")

    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/webhook")
async def stripe_webhook_endpoint(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
      
        raise HTTPException(status_code=400, detail="Invalid webhook payload")
    except stripe.SignatureVerificationError as e: # <-- CORRECTED
        
        print(f"Webhook signature verification failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    service = PaymentService(db)
    service.handle_webhook_event(event)
    
    return {"status": "success"}