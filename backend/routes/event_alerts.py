from flask import Blueprint, request, jsonify
from config.db_config import get_db_connection

event_alerts_bp = Blueprint('event_alerts', __name__)

# Organizer posts an alert for an event
@event_alerts_bp.route('/post_alert', methods=['POST'])
def post_alert():
    data = request.get_json()
    event_id = data.get('event_id')
    alert_title = data.get('alert_title')
    alert_description = data.get('alert_description')

    if not all([event_id, alert_title]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO event_alerts (event_id, alert_title, alert_description)
            VALUES (%s, %s, %s)
        """, (event_id, alert_title, alert_description))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'message': 'Alert posted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
