import psycopg2
from sqlalchemy.engine import make_url
import os

def create_database_if_not_exists():
    # 1. Get the URL from your environment variable
    # Example: postgresql://sandeep:sandeep@ecommerce_db:5432/carts
    url = make_url(os.getenv("DATABASE_URL"))
    db_name = url.database
    db_user = url.username
    db_password = url.password
    db_host = url.host
    db_port = url.port

    # 2. Connect to the default 'postgres' database
    # We must connect to a database that DEFINITELY exists (like postgres)
    # to run the CREATE DATABASE command.
    conn = psycopg2.connect(
        dbname='postgres',
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port
    )
    conn.autocommit = True # Necessary for CREATE DATABASE
    cursor = conn.cursor()

    # 3. Check if your database exists
    cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{db_name}'")
    exists = cursor.fetchone()

    if not exists:
        print(f"🛠️ Database '{db_name}' not found. Creating it now...")
        cursor.execute(f"CREATE DATABASE {db_name}")
        print(f"✅ Database '{db_name}' created successfully!")
    else:
        print(f"👍 Database '{db_name}' already exists.")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    create_database_if_not_exists()