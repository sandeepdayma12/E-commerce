from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
# from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app.models.db import get_db
from app.models.schemas import Users,Admins,User_login,Admin_login
from app.services.user_service import Authservice
from app.utils.jwt import verify_token
from app.services.user_service import user_service
from app.services.admin_service import Adminservice
router=APIRouter()
@router.post("/user/register", status_code=201)
def register_user(payload: Users, db: Session = Depends(get_db)):
    svc = user_service(db)
    try:
        user = svc.register(payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "user created", "email": user.Email}
@router.post("/admin/register",status_code=201)
def register_admin(payload:Admins,db:Session=Depends(get_db)):
    svc=Adminservice(db)
    try:
        admin=svc.register(payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=400,detail=str(e))   
    return {"message":"Admin Created","email":admin.Email}
@router.post("/user/login",status_code=201)
def login_user(payload:User_login, db:Session=Depends(get_db)):
    svc=user_service(db)
    result = svc.login(**payload.dict())
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    return result
@router.get("/profile")
def get_user_profile(current_user: dict = Depends(verify_token)):
    return {"message": "Welcome!", "user": current_user["sub"]}

@router.post("/admin/login")
def admin_login(payload:Admin_login,db:Session=Depends(get_db)):
    svc=Adminservice(db)
    result=svc.login(**payload.dict())
    if "error"  in result:
        raise HTTPException(status_code=401, detail=result["erroe"])
    return result
@router.get("/admin_profile")
def get_admin(current_admim:dict=Depends(verify_token)):
    return {"message":"sucefullt loged_in","role":current_admim['sub','role']}    