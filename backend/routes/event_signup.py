from flask import Blueprint, request, jsonify,session
from config.db_config import get_db_connection

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