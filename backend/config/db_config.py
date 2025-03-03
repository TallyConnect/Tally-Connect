import mysql.connector
import os
from dotenv import load_dotenv

# Get absolute path of the .env file
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../.env'))
print(f"Loading .env from: {env_path}")  # ✅ Debugging step

# Load .env file
load_dotenv(env_path)

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD") if os.getenv("DB_PASSWORD") else "",
        database=os.getenv("DB_NAME")
    )
