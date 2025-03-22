from flask import Blueprint, request, jsonify
from config.db_config import get_db_connection
from datetime import timedelta

moderation_bp = Blueprint('moderation', __name__)

# 🔹 Fetch all events so the moderator can see their statuses
@moderation_bp.route('/moderator/events', methods=['GET'])
def get_all_events():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM events")
    events = cursor.fetchall()
    db.close()

    # Convert timedelta and other non-serializable types to strings
    for event in events:
        for key, value in event.items():
            if isinstance(value, (bytes, bytearray)):
                event[key] = value.decode('utf-8')
            elif hasattr(value, 'isoformat'):
                event[key] = value.isoformat()
            elif isinstance(value, timedelta):
                event[key] = str(value)

    return jsonify(events)



# 🔹 Approve an event: set status to Scheduled and approval to Approved
@moderation_bp.route('/moderator/approve-event', methods=['POST'])
def approve_event():
    data = request.json
    event_id = data.get("event_id")

    if not event_id:
        return jsonify({"error": "Missing event_id"}), 400

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        UPDATE events
        SET moderator_approval = 'Approved',
            event_status = 'Scheduled'
        WHERE event_id = %s
    """, (event_id,))
    db.commit()
    db.close()

    return jsonify({"message": "Event approved and status updated."})


# 🔹 Deny an event: set status to Canceled and approval to Denied
@moderation_bp.route('/moderator/deny-event', methods=['POST'])
def deny_event():
    data = request.json
    event_id = data.get("event_id")

    if not event_id:
        return jsonify({"error": "Missing event_id"}), 400

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        UPDATE events
        SET moderator_approval = 'Denied',
            event_status = 'Canceled'
        WHERE event_id = %s
    """, (event_id,))
    db.commit()
    db.close()

    return jsonify({"message": "Event denied and status updated."})
