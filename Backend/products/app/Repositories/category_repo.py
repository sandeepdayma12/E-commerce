from app.Repositories.base_repo import Base_Repo
from app.models.models import Category as CategoryModel


class CategoryRepo(Base_Repo):
    def __init__(self, db):
        super().__init__(db)

    def create(self, data):
        new_category = CategoryModel(**data)
        self.db.add(new_category)
        self.db.commit()
        self.db.refresh(new_category)
        return new_category

    def get_by_id(self, id: int):
        return self.db.query(CategoryModel).filter(CategoryModel.id == id).first()

    def get_all(self):
        return self.db.query(CategoryModel).all()

    def update(self, id: int, data: dict):
        category = self.db.query(CategoryModel).filter(CategoryModel.id == id).first()
        if not category:
            return None
        for key, value in data.items():
            setattr(category, key, value)
        self.db.commit()
        self.db.refresh(category)
        return category

    def delete(self, id: int):
        category = self.db.query(CategoryModel).filter(CategoryModel.id == id).first()
        if category:
            self.db.delete(category)
            self.db.commit()
            return True
        return False
