from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import os

# --- Load Config ---
SECRET_KEY = "a_super_secret_key_that_must_be_identical_in_all_services"
ALGORITHM = "HS256"
AUTH_SERVICE_LOGIN_URL = "http://127.0.0.1:8003/user/login"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=AUTH_SERVICE_LOGIN_URL)

def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    print("\n--- [Cart Service] Auth Dependency Running ---")
    print(f"Received token (first 15 chars): {token[:15]}...")
    print(f"Using SECRET_KEY (first 5 chars): {SECRET_KEY[:5]}...")

    """Dependency that verifies JWT and returns the user ID ('sub' claim)."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        print(f"VALIDATION SUCCESS: User ID is '{user_id}'")
        print("--- Auth Dependency Finished ---\n")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return user_id