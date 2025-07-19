from flask import Flask
from config import Config
from flask_pymongo import PyMongo
from flask_cors import CORS
from api.routes import api_bp
from api.collections import collections_bp
from api.auth_routes import auth_bp

app = Flask(__name__)

# Enable CORS
CORS(app, origins=[Config.FRONTEND_URL], supports_credentials=True)

# Setup MongoDB
app.config.from_object(Config)
mongo = PyMongo(app)
app.mongo = mongo  # Optional, for easier access in routes

# Register Blueprints
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(collections_bp, url_prefix="/collections")
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# Index setup
with app.app_context():
    print("Connected to MongoDB:", mongo.db.name)  # Should print "db"
    # Ensure indexes
    mongo.db.links.create_index(
        [("user_id", 1), ("url", 1)],
        unique=True,
        partialFilterExpression={"save_type": {
            "$in": ["full_page", "selected_text"]}}
    )
    mongo.db.links.create_index([("tags", 1)])

if __name__ == '__main__':
    app.run(port=5000, debug=True, threaded=True)
