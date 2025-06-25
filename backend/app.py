from flask import Flask
from config import Config
from flask_pymongo import PyMongo
from flask_cors import CORS
from api.routes import api_bp
from api.collections import collections_bp

app = Flask(__name__)

# Enabling CORS
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# Mongo Config
app.config.from_object(Config)
mongo = PyMongo(app)

app.mongo = mongo

# api Blueprint
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(collections_bp, url_prefix="/collections")


with app.app_context():
    mongo.db.links.create_index([("user_id", 1), ("url", 1)], unique=True, partialFilterExpression={
        # Apply uniqueness if save_type is either of these values
        "save_type": {"$in": ["full_page", "selected_text"]}
    }
    )
    mongo.db.links.create_index([("tags", 1)])


if __name__ == '__main__':
    app.run(port=5000, debug=True, threaded=True)
