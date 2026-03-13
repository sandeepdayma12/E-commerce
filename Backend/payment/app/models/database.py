"""
Compat module. Prefer importing from app.models.db to avoid duplicate engines.
"""
from .db import engine, Base, SessionLocal
