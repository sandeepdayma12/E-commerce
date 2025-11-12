
from fastapi import FastAPI
from app.Routes.routes import router        
from app.models.database import engine, Base

from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)


app = FastAPI()

app.include_router(router)
origins = [
    "http://localhost:5173",  # your React/Vite frontend
    "http://127.0.0.1:5173",  # sometimes Vite runs on 127.0.0.1
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # allowed origins
    allow_credentials=True,
    allow_methods=["*"],              # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # allow all headers
)

@app.get("/")
def root():
    return {"message": "Auth service is running!"}

