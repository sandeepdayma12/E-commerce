from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer
from app.models.models import Product
from app.Repository.Repo import Search_Repo

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

class SearchService:
    def __init__(self, db: Session):
        self.repo = Search_Repo(db)

    def perform_search(self, query: str):
        query_embedding = embedding_model.encode(query)
        search_results = self.repo.search_products_by_embedding(query_embedding)
        return search_results
