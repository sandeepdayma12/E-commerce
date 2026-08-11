import os
import json
from typing import List
from fastapi import UploadFile
from app.Repositories.base_repo import Base_Repo
from app.models.models import Product

UPLOAD_DIR = "static/product_images"  # store images in this folder

os.makedirs(UPLOAD_DIR, exist_ok=True)


def _normalize_image_path(image_path):
    if image_path is None:
        return []
    if isinstance(image_path, list):
        return [p for p in image_path if p]
    if isinstance(image_path, str):
        trimmed = image_path.strip()
        if not trimmed:
            return []
        try:
            parsed = json.loads(trimmed)
            if isinstance(parsed, list):
                return [p for p in parsed if p]
            if parsed:
                return [str(parsed)]
        except (json.JSONDecodeError, TypeError):
            return [trimmed]
    return []


class ProductRepo(Base_Repo):
    def __init__(self, db):
        super().__init__(db)

    def _save_images(self, images: List[UploadFile]):
        """Save uploaded images and return list of file paths."""
        if not images:
            return []
        saved_paths = []
        for image in images:
            file_path = os.path.join(UPLOAD_DIR, image.filename)
            with open(file_path, "wb") as buffer:
                buffer.write(image.file.read())
            saved_paths.append(file_path)
        return saved_paths

    def create(self, data: dict, images: List[UploadFile], admin_id: int):
        image_path = self._save_images(images)
        data["image_path"] = _normalize_image_path(image_path)
        data["admin_id"] = admin_id

        new_product = Product(**data)
        self.db.add(new_product)
        self.db.commit()
        self.db.refresh(new_product)
        return new_product

    def get_by_id(self, id: int):
        return self.db.query(Product).filter(Product.id == id).first()

    def get_all(self):
        return self.db.query(Product).all()

    def update(self, id: int, data: dict, images: List[UploadFile] = None):
        product = self.db.query(Product).filter(Product.id == id).first()
        if not product:
            return None

        existing_images = _normalize_image_path(product.image_path)

        if images:
            new_images = self._save_images(images)
            data["image_path"] = existing_images + new_images
        else:
            data["image_path"] = existing_images

        for key, value in data.items():
            setattr(product, key, value)

        self.db.commit()
        self.db.refresh(product)
        return product

    def delete(self, id: int):
        product = self.db.query(Product).filter(Product.id == id).first()
        if product:
            self.db.delete(product)
            self.db.commit()
            return True
        return False

    def get_by_admin_id(self, admin_id: int):
        return self.db.query(Product).filter(Product.admin_id == admin_id).all()
