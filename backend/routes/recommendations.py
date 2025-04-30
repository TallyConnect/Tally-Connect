from flask import Blueprint, jsonify, request
from flask_cors import CORS
from config.db_config import get_db_connection
from datetime import date, timedelta

# Define the blueprint
recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/recommended_events', methods=['GET'])
def recommended_events():
    try:
        user_name = request.args.get('user_name')

        # Connect to the database
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)  # Use dictionary=True to get results as dictionaries

        # Fetch the user's preferences
        user_query = "SELECT user_preferences FROM users WHERE user_name = %s"
        cursor.execute(user_query, (user_name,))
        user_result = cursor.fetchone()

        if not user_result:
            cursor.close()
            db.close()
            return jsonify({'message': 'User not found'}), 404

        user_preferences = user_result['user_preferences']
        preferences = [pref.strip() for pref in user_preferences.split(",")] if user_preferences else []

        recommended_events = []
        seen_event_ids = set()

        # Fetch events based on user preferences
        for category_name in preferences:
            category_query = "SELECT category_id FROM event_categories WHERE category_name = %s"
            cursor.execute(category_query, (category_name,))
            category_result = cursor.fetchone()

            if category_result:
                category_id = category_result['category_id']
                events_query = """
                    SELECT e.event_id, e.event_title, e.event_description, e.event_location, 
                           e.event_date, e.event_time, e.flyer_url
                    FROM events e
                    JOIN event_tags et ON e.event_id = et.event_id
                    WHERE et.tag_id = %s 
                      AND e.event_status = 'Scheduled' 
                      AND e.moderator_approval = 'Approved'
                """
                cursor.execute(events_query, (category_id,))
                events_result = cursor.fetchall()

                for event in events_result:
                    if event['event_id'] not in seen_event_ids:
                        recommended_events.append({
                            'event_id': event['event_id'],
                            'event_title': event['event_title'],
                            'event_description': event['event_description'],
                            'event_location': event['event_location'],
                            'event_date': event['event_date'].isoformat() if isinstance(event['event_date'], date) else str(event['event_date']),
                            'event_time': str(event['event_time']) if isinstance(event['event_time'], timedelta) else event['event_time'],
                            'flyer_url': event['flyer_url']
                        })
                        seen_event_ids.add(event['event_id'])

        # Debugging prints
        print(f"User name: {user_name}")
        print(f"User preferences: {preferences}")
        print(f"Recommended events: {recommended_events}")

        # Close the cursor and connection
        cursor.close()
        db.close()

        return jsonify({'recommended_events': recommended_events})

    except Exception as e:
        print("🔥 Error in recommended_events:", str(e))
        if 'db' in locals():
            db.close()
        return jsonify({"error": "Internal server error"}), 500
