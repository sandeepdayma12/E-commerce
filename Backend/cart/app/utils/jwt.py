from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import os

# --- Load Config ---
SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
ALGORITHM = "HS256"
AUTH_SERVICE_LOGIN_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001") + "/user/login"


oauth2_scheme = OAuth2PasswordBearer(tokenUrl=AUTH_SERVICE_LOGIN_URL)

def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    """Dependency that verifies JWT and returns the user ID ('sub' claim)."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return user_id