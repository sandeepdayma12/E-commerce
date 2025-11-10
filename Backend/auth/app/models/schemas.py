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


