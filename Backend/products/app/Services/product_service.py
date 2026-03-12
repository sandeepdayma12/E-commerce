from app.Services.base_service import Base_service
from app.Repositories.products_repo import ProductRepo
from typing import List
from fastapi import UploadFile

class ProductService(Base_service):
    def __init__(self, db):
        self.repo = ProductRepo(db)
        
    # FIXED: admin_id added, correct argument order for repo.create()
    def create(self, data: dict, images: List[UploadFile], admin_id: int):
        return self.repo.create(data, images, admin_id)

    def get_product(self, id: int):
        product = self.repo.get_by_id(id)
        if not product:
            return {"error": "Product not found"}
        return product

    def list_product(self):
        return self.repo.get_all()

    def update(self, id: int, data: dict, images: List[UploadFile] = None):
        updated = self.repo.update(id, data, images)
        if not updated:
            return {"error": "Product not found"}
        return updated

    def delete(self, id: int):
        deleted = self.repo.delete(id)
        if not deleted:
            return {"error": "Product not found or already deleted"}
        return {"message": "Product successfully deleted"}
    def get_products_by_admin(self, admin_id: int):
        return self.repo.get_by_admin_id(admin_id)
