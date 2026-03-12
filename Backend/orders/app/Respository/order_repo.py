from datetime import date
from decimal import Decimal
from sqlite3 import Date
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import cast, Integer
from typing import List
from app.models import models
from app.models.models import Order, OrderItem, OrderStatus
from sqlalchemy import func, cast, Date
class order_repository:
    def __init__(self, db: Session):
        self.db = db

    def create_order_with_items(self, order: Order, items: List[OrderItem]) -> Order:
        self.db.add(order)
        self.db.flush()
        for item in items:
            item.order_id = order.id
            self.db.add(item)
        self.db.commit()
        self.db.refresh(order)
        return order

    def get_order_by_id(self, order_id: int) -> Order | None:
        return self.db.query(Order).options(joinedload(Order.order_items)).filter(Order.id == order_id).first()

    def get_list_order_by_user(self, user_id: int) -> List[Order]:
        return self.db.query(Order).filter(Order.user_id == str(user_id)).all()

    def update_order_status(self, order_id: int, new_status: OrderStatus) -> Order | None:
        db_order = self.get_order_by_id(order_id)
        if db_order:
            db_order.status = new_status
            self.db.commit()
            self.db.refresh(db_order)
        return db_order
    


    def get_sales_by_admin_id(self, admin_id: int) -> List[OrderItem]:
        return (
            self.db.query(OrderItem)
            .options(joinedload(OrderItem.order))
            .filter(cast(OrderItem.admin_id, Integer) == admin_id)
            .all()
        )
    def get_daily_sales_analytics(self, start_date: date, end_date: date) -> list:
      
        PROFIT_MARGIN = 0.20
        daily_stats = (
            self.db.query(
                cast(models.Order.created_at, Date).label("date"),
                func.sum(models.OrderItem.price_at_purchase * models.OrderItem.quantity).label("total_sales"),
                func.sum(models.OrderItem.quantity).label("total_items_sold")
            )
            .join(models.Order) # Join OrderItem with Order to access created_at
            .filter(cast(models.Order.created_at, Date).between(start_date, end_date))
            .group_by(cast(models.Order.created_at, Date))
            .order_by(cast(models.Order.created_at, Date))
            .all()
        )

        # The query returns a list of Row objects. We need to format them.
        results = []
        for row in daily_stats:
            total_sales = row.total_sales or 0
            results.append({
                "date": row.date,
                "total_sales": total_sales,
                "total_items_sold": row.total_items_sold or 0,
                "estimated_profit": total_sales * Decimal(str(PROFIT_MARGIN))
            })
            
        return results
