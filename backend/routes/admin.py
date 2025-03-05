from flask import Blueprint, jsonify, session
from config.db_config import get_db_connection

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/users', methods=['GET'])
def get_all_users():
    if "user" not in session or session["user"]["role"] != "Administrator":
        return jsonify({"error": "Unauthorized"}), 403  # ✅ Restrict access to admins

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE role = 'User'")  # ✅ Ensure correct query
    users = cursor.fetchall()
    db.close()

    return jsonify(users)
