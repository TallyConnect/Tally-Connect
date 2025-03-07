from flask import Blueprint, jsonify
from config.db_config import get_db_connection

events_bp = Blueprint('events', __name__, url_prefix='/api')

@events_bp.route('/events', methods=['GET'])
def get_events():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT event_id, event_title, event_date, event_flyer_url FROM events")  # ✅ Ensure correct query
    events = cursor.fetchall()
    db.close()
    return jsonify(events)
