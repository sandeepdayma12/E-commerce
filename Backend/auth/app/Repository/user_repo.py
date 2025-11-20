from sqlalchemy.orm import Session
from app.models.models import user
class user_repository:
    def __init__(self,db:Session):
        self.db=db
    def get_user_by_email(self, email:str):
        return self.db.query(user).filter(user.Email==email).first()  
    
    def create_user(self, user_data: dict):
        new_user = user(
            name=user_data.get("name"),
            Email=user_data.get("email"),
            Mobile_Number=user_data.get("mobile_number"),
            Password=user_data.get("password"),
        )
        self.db.add(new_user)    
        self.db.commit()           # commit changes
        self.db.refresh(new_user)  # 
        return new_user 
    def get_user_by_id(self,user_id:int):
        return self.db.query(user).filter(user.id==user_id).first()  
    