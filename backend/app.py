from flask import Flask
from flask import Blueprint
from flask_cors import CORS
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.event_signup import event_signup_bp
from routes.events import events_bp
from routes.admin import admin_bp
from routes.logout import logout_bp

app = Flask(__name__)
app.secret_key = "your_secret_key"  # ✅ Required for session storage

app.config["SESSION_COOKIE_HTTPONLY"] = False  # ✅ Allow frontend session storage
app.config["SESSION_COOKIE_SAMESITE"] = "None"  # ✅ Allow cross-site requests
app.config["SESSION_COOKIE_SECURE"] = True  

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)  # ✅ Allow React to access Flask sessions

# ✅ Fix incorrect double `/api/api/` issue
app.register_blueprint(auth_bp, url_prefix='/api')  # ✅ Ensure it's `/api`, not `/api/api`
app.register_blueprint(profile_bp, url_prefix='/api')
app.register_blueprint(event_signup_bp, url_prefix='/api')
app.register_blueprint(events_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')
app.register_blueprint(logout_bp, url_prefix='/api')


if __name__ == '__main__':
    print("Starting Flask App...")  # ✅ Debugging output
    app.run(debug=True)
