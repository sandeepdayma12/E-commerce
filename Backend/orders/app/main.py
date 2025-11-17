from fastapi import FastAPI
from app.Router.router import router

app = FastAPI()

app.include_router(router)
