from flask import Blueprint, jsonify, session
from config.db_config import get_db_connection

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api')

@analytics_bp.route('/analytics', methods=['GET'])
def get_organizer_analytics():
    if "user" not in session or session["user"]["role"].lower() not in ["moderator", "administrator"]:
        return jsonify({"error": "Unauthorized"}), 403

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT DISTINCT user_name FROM events")
    organizers = cursor.fetchall()

    results = []

    for org in organizers:
        organizer = org["user_name"]

        cursor.execute("SELECT event_id, event_title FROM events WHERE user_name = %s", (organizer,))
        events = cursor.fetchall()

        organizer_data = {
            "organizer": organizer,
            "total_attendees": 0,
            "avg_rating_overall": None,
            "events": [],
            "disputes": []
        }

        total_rating_sum = 0
        total_rating_count = 0

        for event in events:
            event_id = event["event_id"]
            event_title = event["event_title"]

            cursor.execute("SELECT COUNT(*) AS count FROM eventRegistrations WHERE event_id = %s", (event_id,))
            attendee_count = cursor.fetchone()["count"]

            cursor.execute("""
            SELECT f.user_name AS feedback_user, f.feedback_rating, f.feedback_comments
            FROM events e
            LEFT JOIN feedback f ON e.event_id = f.event_id
            WHERE e.event_id = %s
            """, (event_id,))
            feedback_entries = cursor.fetchall()

            ratings = [f["feedback_rating"] for f in feedback_entries if f["feedback_rating"] is not None]

            avg_rating = sum(ratings) / len(ratings) if ratings else None
            total_rating_sum += sum(ratings)
            total_rating_count += len(ratings)

            organizer_data["total_attendees"] += attendee_count
            organizer_data["events"].append({
                "event_id": event_id,
                "event_title": event_title,
                "attendee_count": attendee_count,
                "average_rating": avg_rating,
                "feedbacks": feedback_entries
            })

            cursor.execute("""
                SELECT dispute_id, dispute_summary, dispute_status, dispute_resolution
                FROM disputes
                WHERE event_id = %s
            """, (event_id,))
            disputes = cursor.fetchall()
            organizer_data["disputes"].extend(disputes)

        if total_rating_count > 0:
            organizer_data["avg_rating_overall"] = total_rating_sum / total_rating_count

        results.append(organizer_data)

    db.close()
    return jsonify(results), 200
