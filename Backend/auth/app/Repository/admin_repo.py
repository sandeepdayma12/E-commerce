from sqlalchemy.orm import Session
from app.models.models import Admin
class Admin_Repo:
    def __init__(self,db:Session):
        self.db=db
    def create_admin(self,admin_data:dict):
        admin = Admin(
            name=admin_data["name"],
            Email=admin_data["email"],
            Mobile_Number=admin_data["Mobile_Number"],
            Goverment_ID=admin_data["Goverment_ID"],
            Id_Number=admin_data["Id_Number"],
            GST_Number=admin_data["GST_Number"],
            Password=admin_data["Password"],
            is_superuser=True
    )

        self.db.add(admin)
        self.db.commit()
        self.db.refresh(admin)
        return admin
    def get_admin(self,email:str):
         return self.db.query(Admin).filter(Admin.Email==email).first()  
    def get_admin_by_id(self, id:int):
        return self.db.query(Admin).filter(Admin.id==id).first()
  
     
        



