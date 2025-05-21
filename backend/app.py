from flask import Flask
from config import Config
from flask_pymongo import PyMongo
from flask_cors import CORS
from api.routes import api_bp

app = Flask(__name__)

# Mongo Config
app.config.from_object(Config)
mongo = PyMongo(app)

app.mongo = mongo

# Enabling CORS
CORS(app)

# api Blueprint
app.register_blueprint(api_bp, url_prefix='/api')

with app.app_context():
    mongo.db.links.create_index("url", unique=True)


if __name__ == '__main__':
    app.run(port=5000, debug=True, threaded=True)
