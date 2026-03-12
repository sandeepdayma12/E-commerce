from fastapi import APIRouter, Depends, HTTPException, status,Form
from sqlalchemy.orm import Session
from  fastapi import Request 
from app.Repository.admin_repo import Admin_Repo
from app.Repository.user_repo import user_repository
from app.models.db import get_db
from app.utils.limit import limiter
from app.utils.jwt import create_access_token
from app.utils.Oauth import oauth
from starlette.responses import RedirectResponse
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
from app.utils.jwt import get_current_user, verify_token

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
@limiter.limit("2/minute")
def login_user(
    # Use the variable name 'username' to directly match the form field.
    request:Request,
    username: str = Form(...), 
    password: str = Form(...),
    db: Session = Depends(get_db),
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
def admin_login(   Email: str = Form(...), 
    password: str = Form(...),
    db: Session = Depends(get_db)):
    svc = Adminservice(db)
    result = svc.login(Email=Email, password=password)
    if "message" in result and "Invalid" in result["message"]:
        return {"message": result["message"]}

    return result


# ---------------- USER PROFILE ----------------
@router.get("/api/user_profile", response_model=UserResponse)
def user_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    repo = user_repository(db)
    user = repo.get_user_by_id(current_user["sub"])


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
    current_admin: dict = Depends(get_current_user),
):
    repo = Admin_Repo(db)
    admin = repo.get_admin_by_id(current_admin["sub"])

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
@router.put("/user/update/{user_id}", response_model=UserResponse)
def update_user_profile(
    user_id: int,
    payload: Users,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # FIX: Convert token ID to int
    if int(current_user["sub"]) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this profile.",
        )

    repo = user_repository(db)
    
    # Best Practice: Exclude 'id' or 'email' if they shouldn't change
    # payload.dict(exclude_unset=True) is safer
    updated_user = repo.update_user(user_id, payload.dict())

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return UserResponse(
        id=updated_user.id,
        name=updated_user.name,
        Email=updated_user.Email,
        Mobile_Number=updated_user.Mobile_Number,
    )
# ---------------- ADMIN UPDATE PROFILE ----------------
@router.put("/admin/update/{admin_id}", response_model=AdminResponse)
def update_admin_profile(       
    admin_id: int,
    payload: Admins,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_user),
):
    if current_admin["sub"] != admin_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this profile.",
        )

    repo = Admin_Repo(db)
    updated_admin = repo.update_admin(admin_id, payload.dict())

    if not updated_admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found.",
        )

    return AdminResponse(
        id=updated_admin.id,
        name=updated_admin.name,
        Email=updated_admin.Email,
        Mobile_Number=updated_admin.Mobile_Number,
        Goverment_ID=updated_admin.Goverment_ID,
        GST_Number=updated_admin.GST_Number,
        is_superuser=updated_admin.is_superuser,
    )
# ---------------- TOKEN REFRESH ----------------
@router.post("/token/refresh", response_model=TokenResponse)
def refresh_token(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    svc = user_service(db)
    result = svc.refresh_token(current_user["sub"])

    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result
# @router.post("/admin/token/refresh", response_model=TokenResponse)
# def refresh_admin_token( 
#     current_admin: dict = Depends(verify_token),
#     db: Session = Depends(get_db) ):

#     svc = Adminservice(db)
#     result = svc.refresh_token(current_admin["sub"])

#     if isinstance(result, dict) and "error" in result:
#         raise HTTPException(status_code=400, detail=result["error"])

#     return result
@router.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):
    return {
        "message": "You are authorized",
        "user": current_user
    }
@router.get('/login/google')
async def login_google(request: Request):
    # This generates the Google login URL and redirects the user
    redirect_uri = request.url_for('auth_google_callback')
    return await oauth.google.authorize_redirect(request, str(redirect_uri))

@router.get("/auth/callback/google", tags=["OAuth2"])
async def auth_google_callback(request: Request, db: Session = Depends(get_db)):
    """Handles the response from Google and issues a JWT"""
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info:
            raise HTTPException(status_code=400, detail="Google auth failed")

        email = user_info.get("email")
        name = user_info.get("name")

        repo = user_repository(db)
        # We need to find user by email (ensure this method exists in your repo)
        user = repo.get_user_by_email(email) 

        if not user:
            # Auto-register if user doesn't exist
            # Map Google data to your 'Users' schema
            new_user_data = {
                "name": name,
                "Email": email,
                "Mobile_Number": "0000000000", # Default or allow Null in DB
                "password": f"google_{user_info.get('sub')}" # Random dummy password
            }
            svc = user_service(db)
            svc.register(new_user_data)
            user = repo.get_user_by_email(email)

        # 3. Issue YOUR project's JWT token
        # Using user.id as 'sub' to match your existing profile logic
        jwt_token = create_access_token(data={"sub": str(user.id)})

        # 4. Redirect to your frontend dashboard with the token
        frontend_url = f"http://localhost:3000/login-success?token={jwt_token}"
        return RedirectResponse(url=frontend_url)
    except Exception as e:
        return {"error": str(e)}

 