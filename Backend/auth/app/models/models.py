from sqlalchemy import String , Integer, ForeignKey,Column,Boolean  
from app.models.database import Base

class user(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String,index=True)
    Email=Column(String,unique=True,index=True)
    Moblile_Number=Column(String,unique=True,index=True)
    Password=Column(String, nullable=False)
    def __repr__(self):
        return f"<User(username={self.username})>"   
class Admin(Base):
    __tablename__="admins"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String,index=True)
    Email=Column(String,unique=True,index=True)
    Moblile_Number=Column(String,unique=True,index=True)
    Goverment_ID=Column(String,unique=True,index=True)
    Id_Number=Column(String,nullable=False)
    GST_Number=Column(String,unique=True,index=True)
    Password=Column(String, nullable=False)
    is_superuser=Column(Boolean,default=0)
    def __repr__(self):
        return f"<User(username={self.username})>"