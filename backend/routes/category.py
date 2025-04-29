from flask import Blueprint, jsonify, request, session
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
    print("Session data:", session)
    if "user" not in session or session.get("user", {}).get("role") != "Organizer":
        return jsonify({"success": False, "error": "Unauthorized"}), 403

    data = request.get_json()
    new_category = data.get('category_name', '').strip()

    if not new_category:
        return jsonify({"success": False, "error": "Category name is required"}), 400

    db = get_db_connection()
    cursor = db.cursor()
    try:
        # Check if category already exists (case-insensitive)
        cursor.execute("SELECT category_id, category_name FROM event_categories WHERE LOWER(category_name) = LOWER(%s)", (new_category.lower(),))
        existing_category = cursor.fetchone()

        if existing_category:
            return jsonify({
                "success": False,
                "message": "Tag already exists",
                "category_id": existing_category[0],
                "category_name": existing_category[1]
            }), 409  # 409 Conflict, but still returning useful data

        # Insert new category
        cursor.execute("INSERT INTO event_categories (category_name) VALUES (%s)", (new_category,))
        db.commit()
        new_category_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message": "New tag created successfully",
            "category_id": new_category_id,
            "category_name": new_category
        }), 201
    except Exception as e:
        print("Error creating category/tag:", e)
        return jsonify({"success": False, "error": "Failed to add category"}), 500
    finally:
        db.close()
