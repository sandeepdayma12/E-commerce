import psycopg2
import os
import time
from sqlalchemy.engine import make_url

def create_auth_db_if_not_exists():
    # 1. Get the URL from environment variable
    # Standard: postgresql://sandeep:sandeep@ecommerce_db:5432/ecommerce_db
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("⚠️ DATABASE_URL not set. Skipping DB creation check.")
        return

    url = make_url(db_url)
    db_name = url.database
    
    # 2. Connection details
    retries = 10
    while retries > 0:
        try:
            # We connect to 'postgres' (the master DB) to check if our DB exists
            conn = psycopg2.connect(
                dbname='postgres',
                user=url.username,
                password=url.password,
                host=url.host,
                port=url.port or 5432
            )
            conn.autocommit = True
            cursor = conn.cursor()

            # 3. Check if the database exists
            cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{db_name}'")
            exists = cursor.fetchone()

            if not exists:
                print(f"🛠️  Auth Service: Creating database '{db_name}'...")
                cursor.execute(f"CREATE DATABASE {db_name}")
                print(f"✅ Auth Service: Database '{db_name}' created successfully!")
            else:
                print(f"👍 Auth Service: Database '{db_name}' already exists.")

            cursor.close()
            conn.close()
            break  # Exit loop on success
            
        except Exception as e:
            print(f"⚠️  Auth Service: Waiting for Postgres... ({retries} retries left). Error: {e}")
            retries -= 1
            time.sleep(3) # Wait 3 seconds before next attempt

if __name__ == "__main__":
    create_auth_db_if_not_exists()vc