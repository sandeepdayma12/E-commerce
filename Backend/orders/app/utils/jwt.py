# app/utils/jwt_dependencies.py

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

# ---------- CONFIG ----------
SECRET_KEY = "a_super_secret_key_that_must_be_identical_in_all_services"
ALGORITHM = "HS256"


# ---------- SECURITY SCHEME ----------
bearer_scheme = HTTPBearer()


# -----------------------------
# 1️⃣ User Dependency
# -----------------------------
def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> int:
    """
    Decode user JWT and return user_id (sub).
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        role = payload.get("role")

        if sub is None or role != "user":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user token",
            )

        return int(sub)

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User token is invalid or expired",
        )


# -----------------------------
# 2️⃣ Admin Dependency
# -----------------------------
def get_current_admin_id(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> int:
    """
    Decode admin JWT and return admin_id (sub).
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        role = payload.get("role")

        if sub is None or role != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin token",
            )

        return int(sub)

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin token is invalid or expired",
        )
