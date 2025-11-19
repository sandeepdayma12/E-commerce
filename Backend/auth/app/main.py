from fastapi import FastAPI
from app.Routes.routes import router        
from app.models.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],       # Allow all HTTP methods
    allow_headers=["*"],       # Allow all headers
)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Auth service is running!"}
