from flask import Blueprint, request, jsonify, session
from flask_cors import cross_origin
from config.db_config import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
@cross_origin(origin='http://localhost:3000', supports_credentials=True)
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    # Step 1: Fetch the user regardless of status
    cursor.execute(
        "SELECT * FROM users WHERE user_name = %s AND user_password = %s AND role = %s",
        (username, password, role)
    )
    user = cursor.fetchone()

    if not user:
        db.close()
        return jsonify({"error": "Invalid credentials"}), 401

    # Step 2: Check if user is suspended
    if user["user_status"] == "Suspended":
        db.close()
        return jsonify({"error": "Account is suspended. Please contact support."}), 403
    
    if user["user_status"] == "Banned":
        db.close()
        return jsonify({"error": "Account is banned. Access permanently denied."}), 403



    # Step 3: If status is Active, proceed with login
   

    session["user"] = {
        "user_name": user["user_name"],
        "role": user["role"],
        "user_email": user["user_email"],
        "user_status": user["user_status"],
        "user_contact_details": user["user_contact_details"],
        "user_preferences": user["user_preferences"]
    }
    session.permanent = True
    db.close()

    return jsonify({"message": "Login successful", "user": session["user"]})


@auth_bp.route('/signup', methods=['POST'])
@cross_origin(origin='http://localhost:3000', supports_credentials=True)
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not username or not email or not password or not role:
        return jsonify({"error": "Missing required fields"}), 400
    
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM users WHERE user_name = %s OR user_email = %s", (username, email))
    existing_user = cursor.fetchone()

    if existing_user:
        db.close()
        return jsonify({"error": "User already exists"}), 400

    cursor.execute(
        "INSERT INTO users (user_name, user_email, user_password, role, user_contact_details, user_preferences, user_status, user_created, user_last_updated)"
        "VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())",
        (username, email, password, role, 'N/A', '[]', 'Active')
    )

    db.commit()
    db.close()

    print(f"User {username} created successfully!")  # ✅ Debugging output
    return jsonify({"message": "User created successfully"}), 201


@auth_bp.route('/logout', methods=['POST'])
@cross_origin(origin='http://localhost:3000', supports_credentials=True)
def logout():
    session.clear()
    print("Logged out successfully!")
    return jsonify({"message": "Logged out successfully"}), 200
