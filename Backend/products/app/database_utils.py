import psycopg2
from sqlalchemy.engine import make_url
import os
import time

def create_database_if_not_exists():
    url = make_url(os.getenv("DATABASE_URL"))
    db_name = url.database
    
    # We connect to the default 'postgres' db to create our specific db
    # Using the service name 'ecommerce_db' as the host
    retries = 5
    while retries > 0:
        try:
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
                print(f"🛠️ Creating database {db_name}...")
                cursor.execute(f"CREATE DATABASE {db_name}")
            
            cursor.close()
            conn.close()
            break
        except Exception as e:
            print(f"Waiting for database... {e}")
            retries -= 1
            time.sleep(5)