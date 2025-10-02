from flask import Flask
from config import Config
from flask_pymongo import PyMongo
from flask_cors import CORS
from api.routes import api_bp
from api.collections import collections_bp
from api.auth_routes import auth_bp
from celery_worker import celery  # Import Celery instance


app = Flask(__name__)

# Enable CORS
CORS(app, origins=[Config.FRONTEND_URL], supports_credentials=True)

# Setup MongoDB
app.config.from_object(Config)
mongo = PyMongo(app)
app.mongo = mongo  # for easier access in routes

# Register Blueprints
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(collections_bp, url_prefix="/collections")
app.register_blueprint(auth_bp, url_prefix="/api/auth")


# Update Celery config with Flask app config
celery.conf.update(broker_url=app.config['CELERY_BROKER_URL'],
                   result_backend=app.config['CELERY_RESULT_BACKEND'])

# Any task that comes from the tasks.link_tasks module should be sent to a specific queue named saveit_links
celery.conf.task_routes = {'tasks.link_tasks.*': {'queue': 'saveit_links'}}


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
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=True)
