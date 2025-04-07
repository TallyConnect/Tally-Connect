from flask import Blueprint, jsonify, request, session
from config.db_config import get_db_connection

feedback_bp = Blueprint('feedback', __name__, url_prefix='/api')

@feedback_bp.route('/feedback', methods=['GET'])
def get_feedback():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    role = session['user']['role'].lower()
    user_name = session['user']['user_name']

    if role == 'participant' or role == 'user':
        cursor.execute("""
            SELECT e.event_id, e.event_title, f.feedback_comments, f.feedback_rating
            FROM events e
            JOIN eventRegistrations r ON e.event_id = r.event_id
            LEFT JOIN feedback f ON e.event_id = f.event_id AND r.user_name = f.user_name
            WHERE r.user_name = %s
        """, (user_name,))
        results = cursor.fetchall()

        if not results:
            return jsonify({
                "message": "No events attended!",
                "pending_feedback": [],
                "attended": []
            }), 200

        pending = [row for row in results if row["feedback_comments"] is None]
        return jsonify({
            "attended": results,
            "pending_feedback": pending
        }), 200

    elif role == 'organizer':
        cursor.execute("""
            SELECT e.event_id, e.event_title, COUNT(DISTINCT r.user_name) AS attendee_count,
                   f.user_name AS feedback_user, f.feedback_rating, f.feedback_comments
            FROM events e
            LEFT JOIN eventRegistrations r ON e.event_id = r.event_id
            LEFT JOIN feedback f ON e.event_id = f.event_id
            WHERE e.user_name = %s
            GROUP BY e.event_id, f.user_name, f.feedback_rating, f.feedback_comments
        """, (user_name,))
        results = cursor.fetchall()
        return jsonify(results), 200

    return jsonify({"error": "Invalid role"}), 400


@feedback_bp.route('/feedback', methods=['POST'])
def submit_feedback():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    user_name = session['user']['user_name']
    event_id = data.get("event_id")
    rating = data.get("feedback_rating")
    comments = data.get("feedback_comments")

    if not event_id or not rating:
        return jsonify({"error": "Missing required fields"}), 400

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO feedback (event_id, user_name, feedback_rating, feedback_comments)
        VALUES (%s, %s, %s, %s)
    """, (event_id, user_name, rating, comments))

    db.commit()
    db.close()

    return jsonify({"message": "Feedback submitted successfully!"})
