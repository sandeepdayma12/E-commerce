from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.Repository.admin_repo import Admin_Repo
from app.Repository.user_repo import user_repository
from app.models.db import get_db
from app.models.schemas import (
    Users,
    Admins,
    User_login,
    Admin_login,
    UserResponse,
    AdminResponse,
    TokenResponse
)
from app.services.user_service import user_service
from app.services.admin_service import Adminservice
from app.utils.jwt import verify_token

router = APIRouter()


@router.post("/user/register", status_code=201)
def register_user(payload: Users, db: Session = Depends(get_db)):
    svc = user_service(db)
    result = svc.register(payload.dict())
    if "message" in result and "exists" in result["message"].lower():
        return {"message": result["message"]}
    return {"message": "User created successfully."}


@router.post("/admin/register", status_code=201)
def register_admin(payload: Admins, db: Session = Depends(get_db)):
    svc = Adminservice(db)
    result = svc.register(payload.dict())
    if isinstance(result, dict) and "message" in result and "exists" in result["message"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )
    return result


@router.post("/user/login", response_model=TokenResponse, status_code=200)
def login_user(payload: User_login, db: Session = Depends(get_db)):
    svc = user_service(db)
    result = svc.login(**payload.dict())
    if "message" in result and "Invalid" in result["message"]:
        return {"message": result["message"]}
    return result


@router.post("/admin/login", response_model=TokenResponse, status_code=200)
def admin_login(payload: Admin_login, db: Session = Depends(get_db)):
    svc = Adminservice(db)
    result = svc.login(**payload.dict())
    if "message" in result and "Invalid" in result["message"]:
        return {"message": result["message"]}
    return result


@router.get("/api/user_profile", response_model=UserResponse)
def user_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token),
):
    user_id_from_token = current_user.get("sub")
    if not user_id_from_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: Missing user identifier",
        )
    repo = user_repository(db)
    user = repo.get_user_by_id(user_id_from_token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id_from_token} not found",
        )
    return user


@router.get("/api/admin_profile", response_model=AdminResponse)
def admin_profile(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(verify_token),
):
    admin_id=current_admin.get("sub")
    if not admin_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: Missing admin identifier",
        )   
    repo = Admin_Repo(db)
    admin = repo.get_admin_by_id(admin_id)
    return  admin
@router.get("/api/verify_token")
def verify_user_token(current_user: dict = Depends(verify_token)):
    return {"message": "Token is valid.", "user": current_user}
@router.get("/api/verify_admin_token")
def verify_admin_token(current_admin: dict = Depends(verify_token)):
    return {"message": "Token is valid.", "admin": current_admin}