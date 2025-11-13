from abc import abstractmethod,ABC
from sqlalchemy.orm import session
class Base_Repo(ABC):
    def __init__(self,db:session):
        self.db=db
    @abstractmethod
    def create_cart(self,user_id:int):
        pass
    @abstractmethod
    def add_item_to_cart(self, product_id:int, user_id:int ,quantity:int ):
        pass
    @abstractmethod
    def update_item_to_quantity(self, product_id:int,quantity:int,cart:'Cart'):
        pass
    @abstractmethod
    def delete_item_to_cart(self, product_id:int,cart:'Cart'):
        pass
    @abstractmethod
    def clear_cart(self, cart:'Cart'):
        pass

        
