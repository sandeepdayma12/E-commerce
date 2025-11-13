from fastapi import FastAPI
from app.Router import router
from app.models.database import Base, engine
from app.Router.router import router
Base.metadata.create_all(bind=engine)

app = FastAPI(title="E-Commerce Product Service")

app.include_router(router)


@app.get("/")
def root():
    return {"message": "Product Service is running"}