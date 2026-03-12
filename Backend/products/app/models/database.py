import os
import time
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Configuration
DB_USER = "sandeep"
DB_PASS = "sandeep"
DB_HOST = "ecommerce_db"
DB_NAME = "product_services" # The one that is currently missing

# 2. THE FIX: Function to create the database if it doesn't exist
def ensure_database_exists():
    # Connect to the default 'postgres' database which always exists
    retries = 10
    while retries > 0:
        try:
            # We connect to 'postgres' to run the 'CREATE DATABASE' command
            conn = psycopg2.connect(
                dbname='postgres',
                user=DB_USER,
                password=DB_PASS,
                host=DB_HOST,
                port=5432
            )
            conn.autocommit = True
            cur = conn.cursor()
            
            # Check if our database exists
            cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
            exists = cur.fetchone()
            
            if not exists:
                print(f"🛠️  Creating database {DB_NAME}...")
                cur.execute(f"CREATE DATABASE {DB_NAME}")
                print(f"✅ Database {DB_NAME} created!")
            
            cur.close()
            conn.close()
            break
        except Exception as e:
            print(f"⚠️  Database not ready yet... retrying in 2s ({e})")
            retries -= 1
            time.sleep(2)

# 3. RUN THE FIX
ensure_database_exists()

# 4. NOW it is safe to create the SQLAlchemy engine
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/{DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()