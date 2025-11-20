import os
import stripe
from sqlalchemy.orm import Session
from app.Repository.repo import Payment_Repo
from app.models.schemas import Paymentintentcreate, Paymentintentresponse
from dotenv import load_dotenv

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


class PaymentService:
    def __init__(self, db: Session):
        self.repo = Payment_Repo(db)

    def create_payment_intent(self, payment_data: Paymentintentcreate) -> dict:
        new_payment = self.repo.Create_pending_payment(
            amount=payment_data.amount,
            currency=payment_data.currency,
            order_id=payment_data.order_id
        )

        amount_in_cents = int(payment_data.amount * 100)

        intent = stripe.PaymentIntent.create(
            amount=amount_in_cents,
            currency=payment_data.currency,
            metadata={"order_id": new_payment.order_id}
        )

        return {
            "client_secret": intent.client_secret,
            "payment_id": new_payment.id
        }

    def handle_webhook_event(self, event: dict):
        event_type = event["type"]
        payment_intent = event["data"]["object"]
        order_id = payment_intent.get("metadata", {}).get("order_id")

        if not order_id:
            print(f"ERROR: Missing order_id in metadata for Payment Intent {payment_intent['id']}")
            return

        order_id = int(order_id)

        if event_type == "payment_intent.succeeded":
            charge_id = payment_intent.get("latest_charge")
            updated_payment = self.repo.update_by_payment(
                order_id=order_id,
                stripe_charge_id=charge_id
            )
            if updated_payment:
                print(f"Payment Succeeded for Order ID: {updated_payment.order_id}")

        elif event_type == "payment_intent.payment_failed":
            updated_payment = self.repo.update_on_payment(order_id=order_id)
            if updated_payment:
                error_message = payment_intent.get("last_payment_error", {}).get("message")
                print(f"Payment Failed for Order ID: {updated_payment.order_id}. Reason: {error_message}")

        else:
            print(f"Unhandled event type: {event_type}")
