from abc import abstractmethod,ABC
from sqlalchemy.orm import session
class Base_Repo(ABC):
    def __init__(self,db:session):
        self.db=db
    @abstractmethod
    def create(self,data):
        pass
    @abstractmethod
    def get_by_id(self,id:int):
        pass
    @abstractmethod
    def get_all(self):
        pass
    @abstractmethod
    def update(self, id:int, data):
        pass
    @abstractmethod
    def delete(self, id:int):
        pass  
