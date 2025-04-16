from flask import Blueprint, jsonify, request, session
from config.db_config import get_db_connection

disputes_bp = Blueprint('disputes', __name__, url_prefix='/api')

@disputes_bp.route('/disputes', methods=['GET'])
def get_disputes():
    if "user" not in session or session["user"]["role"].lower() not in ["administrator", "event analyst and administrator"]:
        return jsonify({"error": "Unauthorized"}), 403

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT d.*, e.user_name AS organizer_id
        FROM disputes d
        JOIN events e ON d.event_id = e.event_id
    """)
    disputes = cursor.fetchall()
    db.close()
    return jsonify(disputes), 200

@disputes_bp.route('/disputes/<int:dispute_id>/resolve', methods=['POST'])
def resolve_dispute(dispute_id):
    if "user" not in session or session["user"]["role"].lower() not in ["administrator", "event analyst and administrator"]:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    resolution = data.get("resolution")
    status = data.get("status", "resolved").upper()

    if not resolution:
        return jsonify({"error": "Resolution text is required"}), 400

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        UPDATE disputes 
        SET dispute_status = %s, 
            dispute_resolution = %s,
            dispute_date_resolved = CURRENT_TIMESTAMP
        WHERE dispute_id = %s
    """, (status, resolution, dispute_id))

    db.commit()
    db.close()

    return jsonify({"message": "Dispute resolved successfully"}), 200

@disputes_bp.route('/my_disputes', methods=['GET'])
def get_my_disputes():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_name = session["user"]["user_name"]
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT d.*, e.user_name AS organizer_id
        FROM disputes d
        JOIN events e ON d.event_id = e.event_id
        WHERE d.raised_by = %s
        ORDER BY dispute_date_resolved DESC
    """, (user_name,))
    disputes = cursor.fetchall()
    db.close()
    return jsonify(disputes), 200

@disputes_bp.route('/submit_dispute', methods=['POST'])
def submit_dispute():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    raised_by = session["user"]["user_name"]
    event_id = data.get("event_id")
    admin_id = data.get("admin_id")
    summary = data.get("dispute_summary")

    if not all([event_id, admin_id, summary]):
        return jsonify({"error": "Missing fields"}), 400

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO disputes (raised_by, event_id, admin_id, dispute_summary, dispute_status)
        VALUES (%s, %s, %s, %s, 'PENDING')
    """, (raised_by, event_id, admin_id, summary))
    db.commit()
    db.close()
    return jsonify({"message": "Dispute submitted successfully"}), 201

@disputes_bp.route('/my_events', methods=['GET'])
def get_user_dispute_events():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    role = session['user']['role'].lower()
    user_name = session['user']['user_name']
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    if role == 'organizer':
        cursor.execute("SELECT event_id, event_title FROM events WHERE user_name = %s", (user_name,))
    else:
        cursor.execute("""
            SELECT e.event_id, e.event_title
            FROM eventRegistrations r
            JOIN events e ON r.event_id = e.event_id
            WHERE r.user_name = %s
        """, (user_name,))

    events = cursor.fetchall()
    db.close()
    return jsonify(events), 200

@disputes_bp.route('/admin_requests', methods=['GET'])
def get_admin_requests():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    organizer_id = session["user"]["user_name"]

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM admin_requests
        WHERE organizer_id = %s
        ORDER BY created_at DESC
    """, (organizer_id,))
    
    messages = cursor.fetchall()
    db.close()

    return jsonify(messages), 200

@disputes_bp.route('/admin_request', methods=['POST'])
def send_admin_request():
    if "user" not in session or session["user"]["role"].lower() != "administrator":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    dispute_id = data.get("dispute_id")
    event_id = data.get("event_id")
    organizer_id = data.get("organizer_id")
    request_message = data.get("request_message")

    if not all([dispute_id, event_id, organizer_id, request_message]):
        return jsonify({"error": "Missing required fields"}), 400

    admin_id = session["user"]["user_name"]

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO admin_requests (dispute_id, event_id, admin_id, organizer_id, request_message)
        VALUES (%s, %s, %s, %s, %s)
    """, (dispute_id, event_id, admin_id, organizer_id, request_message))

    db.commit()
    db.close()

    return jsonify({"message": "Message sent to organizer successfully."}), 200
