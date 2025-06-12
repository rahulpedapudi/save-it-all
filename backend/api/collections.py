from flask import request, jsonify, Blueprint, current_app
from flask_cors import cross_origin
from bson.objectid import ObjectId
from datetime import datetime
from .auth import require_clerk_auth

collections_bp = Blueprint("collections", __name__)


@collections_bp.route("/get", methods=["GET"])
@require_clerk_auth
def get_collections():
    mongo = current_app.mongo
    user_id = request.user_id
    # created collections of a user
    collections = list(mongo.db.folders.find({"user_id": user_id}))
    if not collections:
        return jsonify({"collections": [], "message": "No collections found"}), 200

    # objectID is converted to str, for simplifying any comparisions in the frontend
    for c in collections:
        c["_id"] = str(c["_id"])

    return jsonify({"collections": collections}), 200


# route to create a new collection
@collections_bp.route("/create", methods=["POST"])
@require_clerk_auth
def create_collection():
    mongo = current_app.mongo
    user_id = request.user_id
    data = request.get_json()
    # TODO: need a better schema? and color is defaulted to blue
    collection = {
        "user_id": user_id,
        "name": data["name"],
        "created_at": datetime.now().isoformat(),
        "color": "blue"  # i thought it would be easier to assign colour which will be useful in the UI
    }
    try:
        result = mongo.db.folders.insert_one(collection)
        # print("Data Inserted: ", collection)
        return jsonify({"status": "Success", "collection": {"_id": str(result.inserted_id), "name": collection["name"]}}),  201
    except Exception as e:
        print("Error ", e)
        return jsonify({"stauts": "Failed", "Error": e}), 500
