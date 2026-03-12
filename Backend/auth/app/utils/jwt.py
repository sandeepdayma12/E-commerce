from datetime import timedelta, datetime
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# ---------- CONFIG ----------
SECRET_KEY = "a_super_secret_key_that_must_be_identical_in_all_services"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# ---------- CREATE TOKEN ----------
def create_access_token(data: dict):
    """
    Create JWT Token
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token


# ---------- VERIFY TOKEN ----------
def verify_token(token: str):
    """
    Decode JWT and return payload.
    ⭐ Admin: convert 'sub' to int
    ⭐ User: do NOT modify 'sub'
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        sub = payload.get("sub")
        role = payload.get("role")

        # ⭐ Only admin 'sub' should be integer ⭐
        if role == "admin":
            try:
                sub = int(sub)
            except:
                raise HTTPException(
                    status_code=400,
                    detail="Admin ID must be an integer"
                )

        # ⭐ Do NOT change user id ⭐
        return {
            "sub": sub,
            "role": role
        }

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
bearer_scheme = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    return verify_token(token) 