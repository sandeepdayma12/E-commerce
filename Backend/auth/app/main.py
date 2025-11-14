
from fastapi import FastAPI
from app.Routes.routes import router        
from app.models.database import engine, Base

from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)


app = FastAPI()

origins = [
    "http://localhost:5173",  # your React/Vite frontend
    "http://127.0.0.1:5173", 
    "http://localhost:8002",  # The address of your Cart Service docs
    "http://localhost:8001",  # The address of your Product Service docs
    "http://localhost:3000",  # A common port for a React/Vue/Angular frontend
    "http://localhost:8080",  # Another common frontend port
    "*"                      # A wildcard 
      
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # allowed origins
    allow_credentials=True,
    allow_methods=["*"],              # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # allow all headers
)
app.include_router(router)

@app.get("/")
def root():
    return {"message": "Auth service is running!"}

