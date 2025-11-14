# In app/Respository/Base_repo.py
from abc import ABC, abstractmethod

class Base_Repo(ABC):
    def __init__(self, db):
        self.db = db

    @abstractmethod
    def get_or_create_cart(self, user_id: str):
        pass

    @abstractmethod
    def add_item_to_cart(self, cart: 'Cart', product_id: int, quantity: int):
        pass

    @abstractmethod
    def update_item_quantity(self, cart: 'Cart', product_id: int, new_quantity: int):
        pass

    @abstractmethod
    def delete_item_to_cart(self, cart: 'Cart', product_id: int):
        pass

    @abstractmethod
    def clear_cart(self, cart: 'Cart'):
        pass