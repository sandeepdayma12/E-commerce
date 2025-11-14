from pydantic import BaseModel, EmailStr
from typing import Optional

class Users(BaseModel):
    name:str
    email: EmailStr
    mobile_number: int
    password: str
class User_login(BaseModel):
    email:EmailStr
    password:str

class Admins(BaseModel):
    name:str
    email: EmailStr
    mobile_number: int
    goverment_id: int
    id_proof_path: str
    gst_number: int
    password: str
class Admin_login(BaseModel):
    Email:EmailStr
    password:str    


class UserResponse(BaseModel):
    id: int
    name: str
    Email: EmailStr
    Moblile_Number: int 

    class Config:
        from_attributes = True  
class AdminResponse(BaseModel):
    id: int
    name: str
    Email: EmailStr
    Moblile_Number: int
    Goverment_ID: Optional[int] = None
    GST_Number: Optional[int] = None
    is_superuser: bool
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


        
