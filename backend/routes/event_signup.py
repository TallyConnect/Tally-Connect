from flask import Blueprint, request, jsonify,session
from config.db_config import get_db_connection
from datetime import datetime, timedelta
import pytz

def serialize_event_signup(event):
    if 'event_date' in event and isinstance(event['event_date'], datetime):
        event['event_date'] = event['event_date'].date().isoformat()

    if 'event_time' in event:
        if isinstance(event['event_time'], timedelta):
            total_seconds = int(event['event_time'].total_seconds())
            hours = total_seconds // 3600
            minutes = (total_seconds % 3600) // 60
            event['event_time'] = f"{hours:02}:{minutes:02}"
        elif isinstance(event['event_time'], str):
            event['event_time'] = event['event_time']  # Ensure it's a string
        else:
            event['event_time'] = "00:00"  # Default fallback

    if 'event_time' in event:
        event['event_datetime'] = f"{event['event_date']} {event['event_time']}"

    return event


event_signup_bp = Blueprint('event_signup', __name__, url_prefix='/api')

@event_signup_bp.route('/signup_event', methods=['POST'])
def signup_for_event():
    if "user" not in session:
        return jsonify({"error": "You are not logged in"}), 401
    
    data = request.json
    event_id = data.get("event_id")
    user_name = session["user"]["user_name"]

    print(f"Signup attempt - Event ID: {event_id}, User: {user_name}")

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM eventRegistrations WHERE event_id = %s AND user_name = %s", (event_id, user_name))
    existing_registration = cursor.fetchone()

    if existing_registration:
        db.close()
        print("User already registered for event")
        return jsonify({"error": "You are already registered for this event"}), 400
    
    cursor.execute("INSERT INTO eventRegistrations (event_id, user_name, registration_status) VALUES (%s, %s, %s)", (event_id, user_name, True))
    db.commit()
    db.close()
    
    print("User successfully registered for event")
    return jsonify({"message": "You have successfully registered for the event"}), 201

@event_signup_bp.route('/unregister_event', methods=['DELETE'])
def unregister_from_event():
    if "user" not in session:
        return jsonify({"error": "You are not logged in"}), 401
    
    data = request.json
    event_id = data.get("event_id")
    user_name = session["user"]["user_name"]

    print(f"Unregister attempt - Event ID: {event_id}, User: {user_name}")

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM eventRegistrations WHERE event_id = %s AND user_name = %s", (event_id, user_name))
    existing_registration = cursor.fetchone()

    if not existing_registration:
        db.close()
        print("User is  not registered for this event")
        return jsonify({"error": "You are not registered for this event"}), 400
    
    cursor.execute("DELETE FROM eventRegistrations WHERE event_id = %s AND user_name = %s", (event_id, user_name))
    db.commit()
    db.close()

    print("User successfully unregistered from event")
    return jsonify({"message": "You have successfully unregistered from the event"}), 200

@event_signup_bp.route('/user_calendar', methods=['GET'])
def get_user_calendar():
    if "user" not in session:
        return jsonify({"error": "You are not logged in"}), 401

    user_name = session["user"]["user_name"]
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    query = """
        SELECT e.event_id, e.event_title, e.event_description, e.event_date, e.event_time, e.event_location
        FROM eventRegistrations er
        JOIN events e ON er.event_id = e.event_id
        WHERE er.user_name = %s 
    """
    params = [user_name]

    if month and year:
        query += " AND MONTH(e.event_date) = %s AND YEAR(e.event_date) = %s"
        params += [month, year]

    cursor.execute(query, params)
    events = cursor.fetchall()
    db.close()

    utc = pytz.utc
    event_list = []

    for event in events:
        if isinstance(event["event_date"], datetime):
            event_date = event["event_date"].date()
        else:
            event_date = event["event_date"]

        if isinstance(event["event_time"], timedelta):
            total_seconds = int(event["event_time"].total_seconds())
            hours = total_seconds // 3600
            minutes = (total_seconds % 3600) // 60
            event_time = f"{hours:02}:{minutes:02}"
        else:
            event_time = event["event_time"]

        # Combine into datetime and localize
        combined_datetime = datetime.strptime(f"{event_date} {event_time}", "%Y-%m-%d %H:%M")
        event_datetime_utc = utc.localize(combined_datetime)

        event_list.append({
            "event_id": event["event_id"],
            "event_title": event["event_title"],
            "event_description": event["event_description"],
            "event_location": event["event_location"],
            "datetime": event_datetime_utc.isoformat(),  # UTC ISO format for JS
        })

    return jsonify(event_list)



