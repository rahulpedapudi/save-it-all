from flask import request, jsonify, Blueprint, current_app
from flask_cors import cross_origin
from bson.objectid import ObjectId
from datetime import datetime
from .google_auth import require_google_auth

collections_bp = Blueprint("collections", __name__)


@collections_bp.route("/get", methods=["GET"])
@require_google_auth
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


@collections_bp.route("/create", methods=["POST"])
@require_google_auth
def create_collection():
    mongo = current_app.mongo
    user_id = request.user_id
    data = request.json

    name = data.get("name")
    if not name:
        return jsonify({"error": "Name is required"}), 400

    # Check if collection with same name already exists for this user
    existing_collection = mongo.db.folders.find_one(
        {"user_id": user_id, "name": name})
    if existing_collection:
        return jsonify({"error": "Collection with this name already exists"}), 409

    # Create new collection
    collection = {
        "user_id": user_id,
        "name": name,
        "color": data.get("color", "#3B82F6"),  # Default blue color
        "created_at": datetime.utcnow()
    }

    try:
        result = mongo.db.folders.insert_one(collection)
        collection["_id"] = str(result.inserted_id)
        return jsonify({"message": "Collection created successfully", "collection": collection}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create collection: {str(e)}"}), 500


@collections_bp.route("/<collection_id>", methods=["DELETE"])
@require_google_auth
def delete_collection(collection_id):
    mongo = current_app.mongo
    user_id = request.user_id

    try:
        # Verify the collection belongs to the user
        collection = mongo.db.folders.find_one(
            {"_id": ObjectId(collection_id), "user_id": user_id})
        if not collection:
            return jsonify({"error": "Collection not found"}), 404

        # Delete the collection
        result = mongo.db.folders.delete_one(
            {"_id": ObjectId(collection_id), "user_id": user_id})

        if result.deleted_count == 0:
            return jsonify({"error": "Collection not found"}), 404

        # Remove folder_id from all links that were in this collection
        mongo.db.links.update_many(
            {"user_id": user_id, "folder_id": collection_id},
            {"$unset": {"folder_id": ""}}
        )

        return jsonify({"message": "Collection deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to delete collection: {str(e)}"}), 500
