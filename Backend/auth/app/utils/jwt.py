from datetime import timedelta, timezone,datetime
from jose import JWTError, jwt
from fastapi import HTTPException,status
SECRET_KEY = "a_super_secret_key_that_must_be_identical_in_all_services"
algorithm="HS256"
access_token_expire_minutes=30
def create_access_token(data:dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=access_token_expire_minutes)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=algorithm)
    return token
def verify_token(token:str):
    try:
        pyload=jwt.decode(token, SECRET_KEY,algorithms=["HS256"])
        return pyload
    except JWTError:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

