from sqlalchemy.orm import Session
from app.models.models import Payment

class Payment_Repo():
    def __init__(self, db: Session):
        self.db = db

    def Create_pending_payment(
        self, amount: float, currency: str, order_id: int, stripe_payment_intent_id: str
    ) -> Payment:
        new_payment = Payment(
            amount=amount,
            currency=currency,
            order_id=order_id,
            status="pending",
            stripe_payment_intent_id=stripe_payment_intent_id
        )
        self.db.add(new_payment)
        self.db.commit()
        self.db.refresh(new_payment)
        return new_payment

    def get_by_payment(self, order_id: int) -> Payment | None:
        return self.db.query(Payment).filter(
            Payment.order_id == order_id, 
            Payment.status != "succeeded"
        ).first()

    def get_by_payment_intent_id(self, intent_id: str) -> Payment | None:
        return self.db.query(Payment).filter(Payment.stripe_payment_intent_id == intent_id).first()

    def update_payment_intent_id(
        self, order_id: int, new_stripe_payment_intent_id: str
    ) -> Payment | None:
        payment = self.get_by_payment(order_id)
        if payment:
            payment.stripe_payment_intent_id = new_stripe_payment_intent_id
            payment.status = "pending"
            self.db.commit()
            self.db.refresh(payment)
        return payment

    def update_payment_by_intent_id(self, intent_id: str, charge_id: str) -> Payment | None:
        payment = self.get_by_payment_intent_id(intent_id)
        if payment:
            payment.status = "succeeded"
            payment.stripe_charge_id = charge_id
            self.db.commit()
            self.db.refresh(payment)
        return payment

    def update_payment_on_intent_id(self, intent_id: str) -> Payment | None:
        payment = self.get_by_payment_intent_id(intent_id)
        if payment:
            payment.status = "failed"
            self.db.commit()
            self.db.refresh(payment)
        return payment