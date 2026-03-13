from fastapi import FastAPI
from fastapi import Request 
from app.Routes.routes import router        
from app.models.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.utils.limit import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from starlette.middleware.sessions import SessionMiddleware
from .database_utils import create_auth_db_if_not_exists

create_auth_db_if_not_exists()
Base.metadata.create_all(bind=engine)


app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key="your-secret-key",
)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Auth service is running!"}
