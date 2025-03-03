from flask import Blueprint, request, jsonify, session
from config.db_config import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    print(f"Login attempt - Username: {username}, Role: {role}")  # ✅ Debugging

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    # ✅ Log SQL Query before execution
    print(f"Executing Query: SELECT * FROM users WHERE user_name='{username}' AND user_password='{password}' AND role='{role}'")

    cursor.execute("SELECT * FROM users WHERE user_name = %s AND user_password = %s AND role = %s", 
                   (username, password, role))
    user = cursor.fetchone()
    db.close()

    if not user:
        print("User not found in database!")  # ✅ Debugging
        return jsonify({"error": "Invalid credentials"}), 401

    # ✅ Store user session
    session["user"] = user
    session.permanent = True  # ✅ Ensure session persists across requests
    print("Login successful!")  # ✅ Debugging output

    return jsonify({"message": "Login successful", "user": user}), 200
