from flask import Blueprint, jsonify, request, flash, session
from werkzeug.utils import secure_filename
from config.db_config import get_db_connection
import os
import uuid
from datetime import datetime, timedelta, date
import pytz
import json

events_bp = Blueprint('events', __name__, url_prefix='/api')

UPLOAD_FOLDER = 'static/flyers'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def serialize_event(event):
    if isinstance(event.get('event_date'), (datetime, date)):
        event['event_date'] = event['event_date'].isoformat()
    if isinstance(event.get('event_time'), timedelta):
        total_seconds = int(event['event_time'].total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        event['event_time'] = f"{hours:02}:{minutes:02}"
    elif isinstance(event.get('event_time'), str):
        event['event_time'] = event['event_time']  # Ensure it's a string
    else:
        event['event_time'] = "00:00"  # Default fallback

    # Combine event_date and event_time into a datetime field
    if 'event_date' in event and 'event_time' in event:
        event['datetime'] = f"{event['event_date']}T{event['event_time']}:00+00:00"

    # Convert category string to list
    if 'categories' in event and event['categories']:
        event['categories'] = [cat.strip() for cat in event['categories'].split(',')]
    else:
        event['categories'] = []

    print("Serialized Event Data:", event)
    return event

@events_bp.route('/upload_flyer', methods=['POST'])
def upload_flyer():
    print("Upload Folder Path:", os.path.abspath(UPLOAD_FOLDER))

    # Check if the file is present
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']
    print(f"Received File: {file.filename if file else 'No file'}")
    print("Received Form Data:", request.form)

    # Extract form data
    user_name = request.form.get("user_name")
    event_title = request.form.get("event_title")
    event_description = request.form.get("event_description")
    event_location = request.form.get("event_location")
    try:
        event_date = datetime.strptime(request.form.get("event_date"), "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid event_date format"}), 400

    event_time = request.form.get("event_time")
    category_id = request.form.get("category_id")  # This will be a JSON string

    # Validate required fields
    if not file or not user_name or not event_title or not event_description or not event_location or not event_date or not event_time or not category_id:
        return jsonify({"error": "Missing required fields"}), 400

    # Validate file type
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    # Parse category_id
    try:
        category_ids = json.loads(category_id)  # Parse it into a Python list
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid category_id format"}), 400

    # Save the file
    event_id = str(uuid.uuid4())[:8]
    filename = f"{event_id}_{secure_filename(file.filename)}"
    flyer_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(flyer_path)
    flyer_url = f"/static/flyers/{filename}"

    try:
        db = get_db_connection()
        cursor = db.cursor()

        # Insert the event into the database
        cursor.execute("""
            INSERT INTO events (event_id, user_name, event_title, event_description, event_location, event_date, event_time, event_status, flyer_url, moderator_approval)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (event_id, user_name, event_title, event_description, event_location, event_date, event_time, 'Draft', flyer_url, 'Pending'))

        # Insert category IDs into the event_tags table
        for cat_id in category_ids:
            cursor.execute("""
                INSERT INTO event_tags (event_id, tag_id)
                VALUES (%s, %s)
            """, (event_id, cat_id))

        db.commit()
        cursor.close()
        db.close()

        return jsonify({"message": "Flyer uploaded and event created!", "event_id": event_id, "flyer_url": flyer_url}), 200

    except Exception as e:
        print("Error in /upload_flyer:", e)
        return jsonify({"error": "Internal server error"}), 500

@events_bp.route('/events', methods=['GET'])
def get_events():
    role = request.args.get('role')
    username = request.args.get('username')

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    if role == 'organizer':
        cursor.execute("""
            SELECT e.event_id, e.event_title, e.flyer_url, e.event_location, e.event_date, e.event_time, 
                   e.event_description, GROUP_CONCAT(c.category_name) AS categories
            FROM events e
            LEFT JOIN event_tags t ON e.event_id = t.event_id
            LEFT JOIN event_categories c ON t.tag_id = c.category_id
            WHERE e.user_name = %s
            GROUP BY e.event_id
        """, (username,))
    else:
        cursor.execute("""
            SELECT e.event_id, e.event_title, e.flyer_url, e.event_location, e.event_date, e.event_time, 
                   e.event_description, GROUP_CONCAT(c.category_name) AS categories
            FROM events e
            LEFT JOIN event_tags t ON e.event_id = t.event_id
            LEFT JOIN event_categories c ON t.tag_id = c.category_id
            WHERE e.event_status = 'Scheduled' AND e.moderator_approval = 'Approved'
            GROUP BY e.event_id
        """)

    events = cursor.fetchall()
    db.close()

    serialize_events = [serialize_event(event) for event in events]
    return jsonify(serialize_events)

@events_bp.route('/events/<event_id>', methods=['GET'])
def get_event_details(event_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM events WHERE event_id = %s", (event_id,))
    event = cursor.fetchone()
    db.close()

    if event:
        serialized_event = serialize_event(event)
        return jsonify(serialized_event)
    else:
        return jsonify({"error": "Event not found"}), 404

@events_bp.route('/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM events WHERE event_id = %s", (event_id,))
    event = cursor.fetchone()

    if event:
        cursor.execute("DELETE FROM events WHERE event_id = %s", (event_id,))
        db.commit()
        db.close()
        return jsonify({"message": "Event deleted successfully"}), 200
    else:
        db.close()
        return jsonify({"error": "Event not found"}), 404

@events_bp.route('/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    if "user" not in session or session.get("user", {}).get("role") != "Organizer":
        print("SESSION USER:", session.get("user"))
        return jsonify({"error": "Unauthorized"}), 403

    user_name = session.get("user", {}).get("user_name")

    event_title = request.form.get("event_title")
    event_description = request.form.get("event_description")
    event_location = request.form.get("event_location")
    event_date = datetime.strptime(request.form.get("event_date"), "%Y-%m-%d").date()
    event_time = request.form.get("event_time")

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM events WHERE event_id = %s AND user_name = %s", (event_id, user_name))
    existing_event = cursor.fetchone()

    if not existing_event:
        db.close()
        return jsonify({"error": "Event not found or unauthorized"}), 404
    
    tz = pytz.timezone('UTC')  # Ensure that the event date is stored in UTC
    event_datetime = datetime.combine(event_date, datetime.min.time())
    event_datetime = tz.localize(event_datetime)

    cursor.execute("""
        UPDATE events SET event_title = %s, event_description = %s, event_location = %s,
        event_date = %s, event_time = %s, event_last_updated = CURRENT_TIMESTAMP
        WHERE event_id = %s
    """, (
        event_title,
        event_description,
        event_location,
        event_datetime,
        event_time,
        event_id
    ))

    db.commit()
    db.close()
    return jsonify({"message": "Event updated successfully"}), 200

@events_bp.route('/organizer_calendar', methods=['GET'])
def organizer_calendar():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = session["user"]
    if user["role"].lower() != "organizer":
        return jsonify({"error": "Access denied"}), 403

    month = int(request.args.get("month"))
    year = int(request.args.get("year"))

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT event_id, event_title, event_description, event_location,
               event_date, event_time
        FROM events
        WHERE user_name = %s AND MONTH(event_date) = %s AND YEAR(event_date) = %s
    """, (user["user_name"], month, year))

    events = cursor.fetchall()
    db.close()

    for event in events:
        event["datetime"] = f"{event['event_date']}T{event['event_time']}:00+00:00"

    serialize_events = [serialize_event(event) for event in events]
    return jsonify(serialize_events), 200


@events_bp.route('/user_calendar', methods=['GET'])
def user_calendar():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = session["user"]
    if user["role"].lower() not in ["user", "participant"]:
        return jsonify({"error": "Access denied"}), 403

    month = int(request.args.get("month"))
    year = int(request.args.get("year"))

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT e.event_id, e.event_title, e.event_description, e.event_location,
               e.event_date, e.event_time
        FROM events e
        JOIN eventRegistrations r ON e.event_id = r.event_id
        WHERE r.user_name = %s AND MONTH(e.event_date) = %s AND YEAR(e.event_date) = %s
    """, (user["user_name"], month, year))

    events = cursor.fetchall()
    db.close()

    for event in events:
        event["datetime"] = f"{event['event_date']}T{event['event_time']}:00+00:00"

    return jsonify(events), 200

@events_bp.route("/api/assign_tags", methods=["POST"])
def assign_tags():
    data = request.get_json()
    event_id = data["event_id"]
    tag_ids = data["tag_ids"]

    try:
        db = get_db_connection()
        cursor = db.cursor()

        for tag_id in tag_ids:
            cursor.execute("INSERT INTO event_tags (event_id, tag_id) VALUES (%s, %s)", (event_id, tag_id))
        
        db.commit()
        cursor.close()
        db.close()

        return jsonify({"message": "Tags assigned successfully"}), 200
    except Exception as e:
        print("Error assigning tags:", e)
        return jsonify({"error": "Failed to assign tags"}), 500
