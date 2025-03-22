from flask import Blueprint, jsonify, request, session
from config.db_config import get_db_connection

admin_bp = Blueprint('admin', __name__)

# ✅ Retrieve all users - only accessible to administrators
@admin_bp.route('/admin/users', methods=['GET'])
def get_all_users():
    if "user" not in session or session["user"]["role"] != "Administrator":
        return jsonify({"error": "Unauthorized"}), 403

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    db.close()
    return jsonify(users)

# ✅ Activate a user account
@admin_bp.route('/admin/users/<username>/activate', methods=['POST'])
def activate_user(username):
    if "user" not in session or session["user"]["role"] != "Administrator":
        return jsonify({"error": "Unauthorized"}), 403

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("UPDATE users SET user_status = 'Active' WHERE user_name = %s", (username,))
    db.commit()
    db.close()
    return jsonify({"message": f"User '{username}' activated successfully"})

# ✅ Deactivate a user account
@admin_bp.route('/admin/users/<username>/deactivate', methods=['POST'])
def deactivate_user(username):
    if "user" not in session or session["user"]["role"] != "Administrator":
        return jsonify({"error": "Unauthorized"}), 403

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("UPDATE users SET user_status = 'Suspended' WHERE user_name = %s", (username,))
    db.commit()
    db.close()
    return jsonify({"message": f"User '{username}' deactivated successfully"})
