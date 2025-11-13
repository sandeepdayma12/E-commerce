from app.Repository.user_repo import user_repository
from app.utils.hashlib import hashed_password, verify_password
from app.utils.jwt import create_access_token
from app.services.base_service import Authservice
from fastapi import HTTPException, status

class user_service(Authservice):
    def __init__(self, db):
        super().__init__(db)
        self.repo = user_repository(db)

    def register(self, data: dict):
        if self.repo.get_user_by_email(data["email"]):
            return {"message": "User with this email already exists."}
        
        data_to_save = {
            "name": data["name"],
            "email": data["email"],
            "mobile_number": data["mobile_number"],
            "password": hashed_password(data["password"]),
        }
        
        self.repo.create_user(data_to_save)
        return {"message": "User registered successfully."}

    def login(self, email: str, password: str):
        user = self.repo.get_user_by_email(email)
        
        # This is a cleaner way to handle login failures.
        # It will automatically send a 401 Unauthorized status code.
        if not user or not verify_password(password, user.Password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
       
        
        token = create_access_token(user_id=str(user.id), role="user")
        
        return {
            "access_token": token,
            "token_type": "bearer"
        }
