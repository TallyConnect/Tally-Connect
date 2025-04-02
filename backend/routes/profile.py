from flask import Blueprint, jsonify, session, request
from config.db_config import get_db_connection
import os
import uuid
from datetime import datetime, timedelta

profile_bp = Blueprint('profile', __name__,url_prefix='/api')

@profile_bp.route('/profile', methods=['GET'])
def user_profile():
    print("Session Data:", dict(session))  # ✅ Debugging output

    if "user" not in session:
        print("No user in session!")  # ✅ Debugging output
        return jsonify({"error": "Unauthorized"}), 401  

    return jsonify(session["user"])  # ✅ Return logged-in user details

@profile_bp.route('/profile/update', methods=['POST'])
def update_profile():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    username = session["user"]["user_name"]

    new_email = data.get("user_email")
    new_password = data.get("user_password")
    new_contact = data.get("user_contact_details")
    new_preferences = data.get("user_preferences")

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        UPDATE users 
        SET user_email = %s,
            user_password = %s,
            user_contact_details = %s,
            user_preferences = %s
        WHERE user_name = %s
    """, (new_email, new_password, new_contact, new_preferences, username))
    
    db.commit()
    db.close()

    # Update session
    session["user"]["user_email"] = new_email
    session["user"]["user_password"] = new_password
    session["user"]["user_contact_details"] = new_contact
    session["user"]["user_preferences"] = new_preferences

    return jsonify({"message": "Profile updated successfully", "user": session["user"]})