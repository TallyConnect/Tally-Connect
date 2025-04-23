from flask import Flask
from flask import Blueprint
from flask_cors import CORS

from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.event_signup import event_signup_bp
from routes.events import events_bp
from routes.admin import admin_bp
from routes.logout import logout_bp
from routes.moderation import moderation_bp
from routes.feedback import feedback_bp
from routes.disputes import disputes_bp
from routes.analytics import analytics_bp
from routes.event_alerts import event_alerts_bp
from routes.category import category_bp
 
app = Flask(__name__)
app.secret_key = "your_secret_key"  # Required for session storage

# ✅ Add app.config settings
app.config["SESSION_COOKIE_HTTPONLY"] = False
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True

# ✅ Register all blueprints BEFORE setting up CORS
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(profile_bp, url_prefix='/api')
app.register_blueprint(event_signup_bp, url_prefix='/api')
app.register_blueprint(events_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')
app.register_blueprint(logout_bp, url_prefix='/api')
app.register_blueprint(moderation_bp, url_prefix='/api')
app.register_blueprint(feedback_bp, url_prefix='/api')
app.register_blueprint(disputes_bp, url_prefix="/api")
app.register_blueprint(analytics_bp, url_prefix="/api")
app.register_blueprint(event_alerts_bp, url_prefix="/api")
app.register_blueprint(category_bp, url_prefix="/api")

# ✅ Apply CORS globally after blueprint registration
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)


if __name__ == '__main__':
    print("Starting Flask App...")
    app.run(debug=True, host='0.0.0.0', port=5000)
