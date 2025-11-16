from sqlalchemy.orm import Session
from app.models.models import Order
class order_repository:
    def __init__(self,db:Session):
        self.db=db
    def create_order(self, order: Order):
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)
        return order

    def get_order_by_id(self, order_id: int):
        return self.db.query(Order).filter(Order.id == order_id).first()

    def get_list_order_by_user(self, user_id: str):
        return self.db.query(Order).filter(Order.user_id == user_id).all()

    def update_order_status(self,  order: Order):
        self.db.commit()
        self.db.refresh(order)
        return order

    def delete_order(self, order: Order):
        self.db.delete(order)
        self.db.commit()