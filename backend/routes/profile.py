from flask import Blueprint, jsonify, session

profile_bp = Blueprint('profile', __name__,url_prefix='/api')

@profile_bp.route('/profile', methods=['GET'])
def user_profile():
    print("Session Data:", dict(session))  # ✅ Debugging output

    if "user" not in session:
        print("No user in session!")  # ✅ Debugging output
        return jsonify({"error": "Unauthorized"}), 401  

    return jsonify(session["user"])  # ✅ Return logged-in user details
