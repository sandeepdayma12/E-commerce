from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

SECRET_KEY = "a_super_secret_key_that_must_be_identical_in_all_services"
ALGORITHM = "HS256"

# FIX: Use HTTPBearer (NOT OAuth2PasswordBearer)
security = HTTPBearer()


def get_current_admin_id(credentials: HTTPAuthorizationCredentials = Depends(security)):
    print("\n--- [Product Service] Auth Dependency Running ---")
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = payload.get("sub")

        print(f"VALIDATION SUCCESS: Admin ID = '{admin_id}'")

        if admin_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: admin id missing",
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid or expired",
        )

    return admin_id
