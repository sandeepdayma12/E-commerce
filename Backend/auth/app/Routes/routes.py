from fastapi import APIRouter, Depends, HTTPException, status,Form
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


# ---------------- USER REGISTER ----------------
@router.post("/user/register", status_code=201)
def register_user(payload: Users, db: Session = Depends(get_db)):
    svc = user_service(db)
    result = svc.register(payload.dict())
    print("Received payload:", payload.dict())

    # If the service returns an error message
    if "message" in result and "exists" in result["message"].lower():
        return {"message": result["message"]}

    return {"message": "User created successfully."}


# ---------------- ADMIN REGISTER ----------------
@router.post("/admin/register", status_code=201)
def register_admin(payload: Admins, db: Session = Depends(get_db)):
    svc = Adminservice(db)
    result = svc.register(payload.dict())

    # ✅ Check only if result is a dict
    if isinstance(result, dict) and "message" in result and "exists" in result["message"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["message"]
        )

    return result



# ---------------- USER LOGIN ----------------
# In your Auth Service router
@router.post("/user/login", status_code=200)
def login_user(
    # Use the variable name 'username' to directly match the form field.
    username: str = Form(...), 
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Handles user login using form data from Swagger UI.
    """
    svc = user_service(db)
   
    # IMPORTANT: The service layer expects a parameter named 'email'.
    # So, we pass the 'username' variable to the 'email' parameter.
    result = svc.login(email=username, password=password)
    
    return result

# ---------------- ADMIN LOGIN ----------------
@router.post("/admin/login", status_code=200)
def admin_login(payload: Admin_login, db: Session = Depends(get_db)):
    svc = Adminservice(db)
    result = svc.login(**payload.dict())

    if "message" in result and "Invalid" in result["message"]:
        return {"message": result["message"]}

    return result


# ---------------- USER PROFILE ----------------
@router.get("/api/user_profile", response_model=UserResponse)
def user_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token),
):
    repo = user_repository(db)
    user = repo.get_user_by_email(current_user["sub"])

    if not user:
        return {"message": "User not found"}

    return UserResponse(
        id=user.id,
        name=user.name,
        Email=user.Email,
        Mobile_Number=user.Mobile_Number,
    )


# ---------------- ADMIN PROFILE ----------------
@router.get("/api/admin_profile", response_model=AdminResponse)
def admin_profile(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(verify_token),
):
    repo = Admin_Repo(db)
    admin = repo.get_admin(current_admin["sub"])

    if not admin:
        return {"message": "Admin not found"}

    return AdminResponse(
        id=admin.id,
        name=admin.name,
        Email=admin.Email,
        Mobile_Number=admin.Mobile_Number,
        Goverment_ID=admin.Goverment_ID,
        GST_Number=admin.GST_Number,
        is_superuser=admin.is_superuser,
    )
@router.post("/debug/decode-token", tags=["Debugging"])
def decode_token_endpoint(token: str):
    payload = verify_token(token)
    
    # If verify_token succeeds, just return the payload
    return payload