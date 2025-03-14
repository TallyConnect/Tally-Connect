from flask import Blueprint, jsonify, request, flash
from werkzeug.utils import secure_filename
from config.db_config import get_db_connection
import os
import uuid

events_bp = Blueprint('events', __name__, url_prefix='/api')

UPLOAD_FOLDER = 'static/flyers'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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

    print(f"Received data: {event_title}, {event_location}, {event_date}")  # Debugging

    if not file or not event_title or not event_location or not event_date or not event_time or not event_description:
        return jsonify({"error": "Missing required fields"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400
    
    event_id = str(uuid.uuid4())[:8]  # Shorten UUID to 8 characters

    # Secure the filename
    filename = f"{event_id}_{secure_filename(file.filename)}"
    flyer_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(flyer_path)

    flyer_url = f"/static/flyers/{filename}"

    # Save event details in the database
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO events (event_id, user_name, event_title, event_description,
        event_location, event_date, event_time, event_status, flyer_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, 'Scheduled', %s)
        """,
        (event_id, user_name, event_title, event_description, 
         event_location, event_date, event_time, flyer_url)
    )

    db.commit()
    db.close()

    return jsonify({
        "message": "Flyer uploaded successfully!",
        "event_id": event_id,
        "flyer_url": flyer_url
    })

@events_bp.route('/events', methods=['GET'])
def get_events():
    role = request.args.get('role')
    username = request.args.get('username')

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    if role == 'organizer':
        # ✅ Show only organizer's uploaded flyers
        cursor.execute("SELECT event_id, event_title, flyer_url FROM events WHERE user_name = %s", (username,))
    else:
        # ✅ Show all flyers for other roles
        cursor.execute("SELECT event_id, event_title, flyer_url FROM events")

    events = cursor.fetchall()
    db.close()
    return jsonify(events)

