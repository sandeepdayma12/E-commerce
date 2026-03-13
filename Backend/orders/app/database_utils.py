import psycopg2
import os
import time
from sqlalchemy.engine import make_url

def create_order_db_if_not_exists():
    # 1. Get the URL from environment variable
    # Target Example: postgresql://sandeep:sandeep@ecommerce_db:5432/orders_db
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("⚠️ DATABASE_URL not set in Order Service. Skipping creation check.")
        return

    url = make_url(db_url)
    db_name = url.database
    
    # 2. Connection Loop (Wait for Postgres container to be ready)
    retries = 10
    while retries > 0:
        try:
            # Connect to 'postgres' (master DB) to check/create our target DB
            conn = psycopg2.connect(
                dbname='postgres',
                user=url.username,
                password=url.password,
                host=url.host,
                port=url.port or 5432
            )
            conn.autocommit = True
            cursor = conn.cursor()

            # 3. Check if 'orders_db' exists
            cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{db_name}'")
            exists = cursor.fetchone()

            if not exists:
                print(f"🛠️  Order Service: Creating database '{db_name}'...")
                cursor.execute(f"CREATE DATABASE {db_name}")
                print(f"✅ Order Service: Database '{db_name}' created successfully!")
            else:
                print(f"👍 Order Service: Database '{db_name}' already exists.")

            cursor.close()
            conn.close()
            break 
            
        except Exception as e:
            print(f"⚠️  Order Service: Waiting for ecommerce_db... ({retries} retries left).")
            retries -= 1
            time.sleep(3) 

if __name__ == "__main__":
    create_order_db_if_not_exists()