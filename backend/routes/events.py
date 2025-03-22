from flask import Blueprint, jsonify, request, flash
from werkzeug.utils import secure_filename
from config.db_config import get_db_connection
import os
import uuid
from datetime import datetime, timedelta

events_bp = Blueprint('events', __name__, url_prefix='/api')

UPLOAD_FOLDER = 'static/flyers'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def serialize_event(event):
    if isinstance(event.get('event_date'), datetime):
        event['event_date'] = event['event_date'].isoformat()
    if isinstance(event.get('event_time'), timedelta):
        event['event_time'] = str(event['event_time'])
    if isinstance(event.get('event_created'), datetime):
        event['event_created'] = event['event_created'].isoformat()
    if isinstance(event.get('event_last_updated'), datetime):
        event['event_last_updated'] = event['event_last_updated'].isoformat()

    print("Serialized Event Data:", event)
    return event

@events_bp.route('/upload_flyer', methods=['POST'])
def upload_flyer():
    print("Upload Folder Path:", os.path.abspath(UPLOAD_FOLDER))

    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']
    print(f"Received File: {file.filename}")
    print("Received Form Data:", request.form)

    user_name = request.form.get("user_name")
    event_title = request.form.get("event_title")
    event_description = request.form.get("event_description")
    event_location = request.form.get("event_location")
    event_date = request.form.get("event_date")
    event_time = request.form.get("event_time")

    if not file or not event_title or not event_location or not event_date or not event_time or not event_description:
        return jsonify({"error": "Missing required fields"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    # Generate unique filename and save flyer
    event_id = str(uuid.uuid4())[:8]
    filename = f"{event_id}_{secure_filename(file.filename)}"
    flyer_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(flyer_path)
    flyer_url = f"/static/flyers/{filename}"

    # Use stored procedure to insert event
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.callproc("insert_event", (
            user_name,
            event_title,
            event_description,
            event_location,
            event_date,
            event_time,
            'Draft',  # Initial event status
            flyer_url,
            'Pending'  # Initial moderator approval
        ))
        db.commit()
        db.close()
    except Exception as e:
        print("Error inserting event via stored procedure:", e)
        return jsonify({"error": "Database error"}), 500

    return jsonify({
        "message": "Flyer uploaded and event created!",
        "flyer_url": flyer_url
    })

@events_bp.route('/events', methods=['GET'])
def get_events():
    role = request.args.get('role')
    username = request.args.get('username')

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    if role == 'organizer':
        cursor.execute("SELECT event_id, event_title, flyer_url FROM events WHERE user_name = %s", (username,))
    else:
        cursor.execute("SELECT event_id, event_title, flyer_url FROM events WHERE event_status = 'Scheduled' AND moderator_approval = 'Approved'")

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
