import os
import stripe
from sqlalchemy.orm import Session
from app.Repository.repo import Payment_Repo
from app.models import schemas

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL")

class PaymentService:
    def __init__(self, db: Session):
        self.repo = Payment_Repo(db)

    def create_payment_intent(self, payment_data: schemas.Paymentintentcreate) -> dict:
        existing_payment = self.repo.get_by_payment(order_id=payment_data.order_id)
        
        amount_in_cents = int(payment_data.amount * 100)

        intent = stripe.PaymentIntent.create(
            amount=amount_in_cents,
            currency=payment_data.currency,
            automatic_payment_methods={"enabled": True},
            metadata={"order_id": payment_data.order_id}
        )

        if existing_payment:
            payment_record = self.repo.update_payment_intent_id(
                order_id=payment_data.order_id,
                new_stripe_payment_intent_id=intent.id
            )
        else:
            payment_record = self.repo.Create_pending_payment(
                amount=payment_data.amount,
                currency=payment_data.currency,
                order_id=payment_data.order_id,
                stripe_payment_intent_id=intent.id
            )

        return {
            "client_secret": intent.client_secret,
            "payment_id": payment_record.id
        }

    def handle_webhook_event(self, event: dict):
        event_type = event["type"]
        payment_intent = event["data"]["object"]
        intent_id = payment_intent["id"]

        if event_type == "payment_intent.succeeded":
            charge_id = payment_intent.get("latest_charge")
            
            updated_payment = self.repo.update_payment_by_intent_id(
                intent_id=intent_id,
                charge_id=charge_id
            )

            if updated_payment:
                print(f"Payment Succeeded for Order ID: {updated_payment.order_id}")
                self._notify_order_service(updated_payment)
            else:
                print(f"ERROR: Received successful webhook for intent_id {intent_id}, but no matching payment was found.")

        elif event_type == "payment_intent.payment_failed":
            updated_payment = self.repo.update_payment_on_intent_id(intent_id=intent_id)
            if updated_payment:
                error_message = payment_intent.get("last_payment_error", {}).get("message")
                print(f"Payment Failed for Order ID: {updated_payment.order_id}. Reason: {error_message}")
            else:
                print(f"ERROR: Received failed webhook for intent_id {intent_id}, but no matching payment was found.")
        else:
            print(f"INFO: Unhandled event type received: {event_type}")
    
    def _notify_order_service(self, payment_record):
        if not ORDER_SERVICE_URL:
            print("WARNING: ORDER_SERVICE_URL is not set. Cannot notify Order Service.")
            return

        # This payload needs to be constructed based on data from other services (e.g., Cart Service)
        customer_id = 123 # Placeholder
        cart_items = [
            {"product_id": 1, "quantity": 1},
            {"product_id": 2, "quantity": 2}
        ]
        shipping_address = {
            "recipient_name": "Sandeep", "street": "123 Main St",
            "city": "Anytown", "postal_code": "12345", "country": "IN"
        }
        
        order_payload = {
            "items": cart_items,
            "shipping_address": shipping_address,
            "payment_id": payment_record.id
        }

        try:
            import requests
            response = requests.post(f"{ORDER_SERVICE_URL}/orders", json=order_payload, headers={"Authorization": "Bearer ..."}) # A service-to-service token might be needed
            response.raise_for_status()
            print(f"Successfully notified Order Service for Order ID: {payment_record.order_id}")
        except requests.RequestException as e:
            print(f"CRITICAL ERROR: Failed to create order for payment {payment_record.id}: {e}")