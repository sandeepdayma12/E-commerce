from sqlalchemy.orm import Session 
from app.models.models import Payment

class Payment_Repo():
    def __init__(self,db:Session):
        self.db=db
    def Create_pending_payment(self,amount:float, currency:str,order_id:int):
        new_payment=Payment(
            amount=amount,
            currency=currency,
            order_id=order_id,
            status="pending"

        )   
        self.db.add(new_payment) 
        self.db.commit()
        self.db.refresh(new_payment)
        return new_payment
    def get_by_payment(self,order_id:int):
        return self.db.query(Payment).filter(Payment.order_id==order_id).first()
    
    def update_by_payment(self, order_id=int, stripe_charge_id=str):
        payment=self.get_by_payment(order_id)
        if payment:
            payment.status = "succeeded"
            payment.stripe_charge_id = stripe_charge_id
            self.db.commit()
            self.db.refresh(payment)
        return payment
    def update_on_payment(self,order_id:int):
        payment=self.get_by_payment(order_id)
        if payment:
            payment.status = "failed"
            self.db.commit()
            self.db.refresh(payment)
        return payment

    

