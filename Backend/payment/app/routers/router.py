import os
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.services.service import PaymentService
from app.models.schemas import Paymentintentcreate, Paymentintentresponse
from app.models.db import get_db

router = APIRouter()

STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

@router.post(
    "/create-payment-intent",
    response_model=Paymentintentresponse,
    summary="Create a Stripe Payment Intent"
)
def create_payment_intent_endpoint(
    payment_data: Paymentintentcreate,
    db: Session = Depends(get_db)
):
    print(f"Received payment_data: {payment_data}")  # Debug log
    try:
        service = PaymentService(db)
        result = service.create_payment_intent(payment_data)
        print(f"Payment intent created successfully: {result}")
        return result
    except stripe.error.StripeError as e:
        print(f"StripeError details: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {str(e)}"
        )
    except Exception as e:
        print(f"Unexpected error in create_payment_intent: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal error: {str(e)}"
        )

@router.post("/webhook")
async def stripe_webhook_endpoint(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload=payload, sig_header=sig_header, secret=STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    service = PaymentService(db)
    
    # 1. Update your local payment records
    service.handle_webhook_event(event)

    # 2. Logic for Microservice Communication
    if event['type'] == 'payment_intent.succeeded':
        intent = event['data']['object']
        # Metadata is where you find the IDs you sent during 'create-payment-intent'
        order_id = intent.get('metadata', {}).get('order_id')
        user_id = intent.get('metadata', {}).get('user_id')
        
        # 3. Notify other services via Broker
        if order_id:
            from app.services.publisher import publish_payment_success
            publish_payment_success(order_id, user_id, intent['amount'])
    
    return {"status": "success"}