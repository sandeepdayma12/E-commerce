from sqlalchemy.orm import Session
from typing import List
import numpy as np
from app.models.models import Product
class Search_Repo:
    def __init__(self, db: Session):
     self.db = db

    def search_products_by_embedding(self, query_embedding: np.ndarray, top_k: int = 10) -> List[Product]:
        results = (
            self.db.query(Product)
            .order_by(Product.embedding.l2_distance(query_embedding))
            .limit(top_k)
            .all()
        )
        return results
