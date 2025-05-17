from flask import request, jsonify, Blueprint, current_app
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId

# blueprint
api_bp = Blueprint('api', __name__)


@api_bp.route("/save", methods=["POST"])
def save_data():
    mongo = current_app.mongo
    data = request.json
    print("Data Received", data)

    try:
        result = mongo.db.links.insert_one(data)
        return jsonify({
            "status": "success",
            "inserted_id": str(result.inserted_id),
            "received": data
        }), 201
    except DuplicateKeyError:
        return jsonify({
            "status": "duplicate",
            "message": "This URL is already saved."
        }), 409


@api_bp.route("/links", methods=["GET"])
def get_links():
    mongo = current_app.mongo
    links = list(mongo.db.links.find({}))
    # Convert _id to string
    for link in links:
        link["_id"] = str(link["_id"])
    return jsonify(links)


@api_bp.route("/analyze/<int:id>", methods=["GET"])
def get_analyzed_post(id):
    pass


@api_bp.route("/links/<id>", methods=["GET", "DELETE"])
def handle_link(id):
    mongo = current_app.mongo
    if request.method == 'GET':
        link = mongo.db.links.find_one({"_id": ObjectId(id)})
        if link:
            link["_id"] = str(link["_id"])
            return jsonify(link)
        return jsonify({"error": "Link not Found!"}), 404
    if request.method == 'DELETE':
        res = mongo.db.links.delete_one({"_id": ObjectId(id)})
        if res.deleted_count == 1:
            return jsonify({"message": "deleted successfully"}), 200
        else:
            return jsonify({"error": "Link not found"}), 404
