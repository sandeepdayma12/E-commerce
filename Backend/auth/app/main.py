
from fastapi import FastAPI
from app.Routes.routes import router        
from app.models.database import engine, Base


Base.metadata.create_all(bind=engine)


app = FastAPI()

app.include_router(router)


@app.get("/")
def root():
    return {"message": "Auth service is running!"}

