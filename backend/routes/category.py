from flask import Blueprint, jsonify, request
from config.db_config import get_db_connection

category_bp = Blueprint('category', __name__, url_prefix='/api')

@category_bp.route('/categories', methods=['GET'])
def get_categories():
    db = get_db_connection()
    cursor = db.cursor()

    try:
        # Fetch both category_id and category_name
        cursor.execute("SELECT category_id, category_name FROM event_categories ORDER BY category_name ASC")
        categories = [{"id": row[0], "name": row[1]} for row in cursor.fetchall()]
        return jsonify({"categories": categories})  # Return the correct structure
    except Exception as e:
        print("Error fetching categories:", e)
        return jsonify({"error": "Failed to load categories"}), 500
    finally:
        db.close()

@category_bp.route('/categories', methods=['POST'])
def add_category():
    data = request.get_json()
    new_category = data.get('category_name', '').strip()

    if not new_category:
        return jsonify({"error": "Category name is required"}), 400

    db = get_db_connection()
    cursor = db.cursor()
    try:
        cursor.execute("INSERT IGNORE INTO event_categories (category_name) VALUES (%s)", (new_category,))
        db.commit()
        return jsonify({"message": "Category added successfully"})
    except Exception as e:
        print("Error adding category:", e)
        return jsonify({"error": "Failed to add category"}), 500
    finally:
        db.close()
