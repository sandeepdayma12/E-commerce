import os
from pydantic import BaseSettings, Field
from typing import List


class Settings(BaseSettings):
    # App
    APP_NAME: str = "auth-service"
    ENV: str = Field(default="development", env="ENV")
    DEBUG: bool = Field(default=False, env="DEBUG")

    # Security
    SECRET_KEY: str = Field(default="change-me", env="SECRET_KEY")
    ALGORITHM: str = Field(default="HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=30, env="REFRESH_TOKEN_EXPIRE_DAYS")

    # DB
    DATABASE_URL: str = Field(
        default="postgresql://sandeep:sandeep@ecommerce_db:5432/ecommerce_db",
        env="DATABASE_URL",
    )

    # CORS
    CORS_ORIGINS: List[str] = Field(default=["http://localhost:5173"], env="CORS_ORIGINS")

    # Cookies
    REFRESH_COOKIE_NAME: str = Field(default="refresh_token", env="REFRESH_COOKIE_NAME")
    REFRESH_COOKIE_SECURE: bool = Field(default=False, env="REFRESH_COOKIE_SECURE")
    REFRESH_COOKIE_SAMESITE: str = Field(default="lax", env="REFRESH_COOKIE_SAMESITE")
    REFRESH_COOKIE_PATH: str = Field(default="/", env="REFRESH_COOKIE_PATH")


settings = Settings()
