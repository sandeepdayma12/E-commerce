from pydantic import BaseModel, EmailStr,Field
from typing import Optional

class Users(BaseModel):
    name:str
    email: EmailStr
    mobile_number: str
    password: str
class User_login(BaseModel):
    email:EmailStr
    password:str

class Admins(BaseModel):
    name:str
    email: EmailStr
    mobile_number: str
    goverment_id: Optional[str] = None
    Id_Number: str=Field(..., alias="id_number")
    gst_number: str
    password: str
class Admin_login(BaseModel):
    Email:EmailStr
    password:str    


class UserResponse(BaseModel):
    id: int
    name: str
    Email: EmailStr
    Moblile_Number: str 

    class Config:
        from_attributes = True  
class AdminResponse(BaseModel):
    id: int
    name: str
    Email: EmailStr
    Moblile_Number: str
    Goverment_ID: Optional[str] = None
    GST_Number: Optional[str] = None
    is_superuser: bool
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


        
