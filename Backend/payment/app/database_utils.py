import psycopg2
from sqlalchemy.engine import make_url
import os
import time

def create_payment_db_if_not_exists():
    url = make_url(os.getenv("DATABASE_URL"))
    db_name = url.database
    
    retries = 10
    while retries > 0:
        try:
            # Connect to 'postgres' (default master DB) to create our specific DB
            conn = psycopg2.connect(
                dbname='postgres',
                user=url.username,
                password=url.password,
                host=url.host,
                port=url.port
            )
            conn.autocommit = True
            cursor = conn.cursor()
            
            cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{db_name}'")
            exists = cursor.fetchone()
            if not exists:
                print(f"🛠️  Payment Service: Creating database {db_name}...")
                cursor.execute(f"CREATE DATABASE {db_name}")
                print(f"✅  Payment Service: Database {db_name} created!")
            
            cursor.close()
            conn.close()
            break
        except Exception as e:
            print(f"⚠️  Payment Service: Waiting for ecommerce_db... {e}")
            retries -= 1
            time.sleep(3)