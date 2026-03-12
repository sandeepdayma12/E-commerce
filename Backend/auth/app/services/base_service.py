from abc import abstractmethod,ABC
from sqlalchemy.orm import Session
class Authservice(ABC):
    def __init__(self,db:Session):
        self.db=db
    @abstractmethod
    def register(self,pyload):
        pass
    @abstractmethod
    def login(self, pyload):
        pass
          
