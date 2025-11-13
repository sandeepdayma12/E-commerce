from datetime import timedelta, timezone,datetime
from jose import JWTError, jwt
from fastapi import HTTPException,status
secret_key="12klkmj"
algorithm="HS256"
access_token_expire_minutes=2
def create_access_token(user_id:int, role: str):
    expire = datetime.utcnow() + timedelta(minutes=access_token_expire_minutes)
    to_encode = {
        "sub": user_id,  
        "role": role,   
        "exp": expire
    }
    token = jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return token
def verify_token(token:str):
    try:
        pyload=jwt.decode(token, secret_key,algorithms=["HS256"])
        print(pyload["sub"])
        return pyload
    except JWTError:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

