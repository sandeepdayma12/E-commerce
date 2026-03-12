from app.Services.base_service import Base_service
from app.Repositories.category_repo import CategoryRepo

class CategoryService(Base_service):
    def __init__(self, db):
        self.repo = CategoryRepo(db)

    def create(self, data):
        return self.repo.create(data)

    def get_product(self, id: int):
        category = self.repo.get_by_id(id)
        if not category:
            return {"error": "category not found"}
        return category

    def list_product(self):
        return self.repo.get_all()

    def update(self, id: int, data):
        updated = self.repo.update(id, data)
        if not updated:
            return {"error": "category not found"}
        return updated

    def delete(self, id: int):
        deleted = self.repo.delete(id)
        if not deleted:
            return {"error": "category not found or already deleted"}
        return {"message": "category successfully deleted"}
