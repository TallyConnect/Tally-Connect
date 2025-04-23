from flask import Blueprint, jsonify
from config.db_config import get_db_connection

category_bp = Blueprint('category', __name__, url_prefix='/api')

@category_bp.route('/categories', methods=['GET'])
def get_categories():
    db = get_db_connection()
    cursor = db.cursor()

    try:
        cursor.execute("SELECT DISTINCT category_name FROM event_categories ORDER BY category_name ASC")
        categories = [row[0] for row in cursor.fetchall()]
        return jsonify({"categories": categories})
    except Exception as e:
        print("Error fetching categories:", e)
        return jsonify({"error": "Failed to load categories"}), 500
    finally:
        db.close()
