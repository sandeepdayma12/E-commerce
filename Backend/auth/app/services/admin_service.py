from app.Repository.admin_repo import Admin_Repo
from app.utils.hashlib import hashed_password, verify_password
from app.utils.jwt import create_access_token
from app.services.base_service import Authservice
class Adminservice(Authservice):
    def __init__(self, db):
        super().__init__(db)
        self.repo = Admin_Repo(db)

    def register(self, admin_data: dict):
        if self.repo.get_admin(admin_data["email"]):
            return {"message": "Admin with this email already exists."}
        
        admin = {
            "name": admin_data["name"],
            "email": admin_data["email"],
            "Moblile_Number": admin_data["mobile_number"],
            "Goverment_ID": admin_data["goverment_id"],
            "Id_proof_path": admin_data["id_proof_path"],
            "GST_Number": admin_data["gst_number"],
            "Password": hashed_password(admin_data["password"]),
            "is_superuser": True
        }
        return self.repo.create_admin(admin)

    def login(self, Email: str, password: str):
        admin = self.repo.get_admin(Email)
        
        if not admin:
            return {"message": "Admin not found."}
        
        if not verify_password(password, admin.Password):
            return {"message": "Invalid password."}
        
        token = create_access_token({"sub": admin.Email, "role": "admin"})
        return {
            "message": "Login successful.",
            "access_token": token,
            "token_type": "bearer"
        }
