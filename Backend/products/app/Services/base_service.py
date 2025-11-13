from abc import abstractmethod , ABC
from sqlalchemy.orm import session
class Base_service(ABC):
    def __init__(self, db:session):
        self.db=db
    @abstractmethod    
    def create(self,data):
        pass  
    @abstractmethod
    def get_product(self, id:int):
        pass
    @abstractmethod
    def list_product(self):
        pass
    @abstractmethod
    def update(self,id:int , data):
        pass
    @abstractmethod
    def delete(self, id:int):
        pass
