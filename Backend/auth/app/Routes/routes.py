from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.Repository.admin_repo import Admin_Repo
from app.models.db import get_db
from app.models.schemas import Users,Admins,User_login,Admin_login,UserResponse,AdminResponse
from app.services.user_service import Authservice
from app.utils.jwt import verify_token
from app.services.user_service import user_service
from app.services.admin_service import Adminservice
from app.Repository.user_repo import user_repository
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
@router.get("/api/user_profile/{id}", response_model=UserResponse)  
def user_profile(id:int,db:Session=Depends(get_db)):
    repo = user_repository(db)
    user = repo.get_user_by_id(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
@router.get("/api/admin/{id}",response_model=AdminResponse) 
def admin_profile(id:int,db:Session=Depends(get_db)):
    repo=Admin_Repo(db)
    admin=repo.get_admin_by_id(id)
    if not admin:
        raise HTTPException(status_code=404, details="admin not found")
    return admin
