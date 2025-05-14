from flask import request, jsonify, Blueprint, current_app

# blueprint
api_bp = Blueprint('api', __name__)


@api_bp.route("/save", methods=["POST"])
def save_data():
    mongo = current_app.mongo
    data = request.json
    print("Data Received", data)
    existing = mongo.db.links.find_one(
        {"url": data.get("tabDetails", {}).get("id")})
    if existing:
        return jsonify({"status": "duplicate", "message": "Entry already exists."}), 409

    result = mongo.db.links.insert_one(data)
    return jsonify({
        "status": "success",
        "inserted_id": str(result.inserted_id),
        "received": data
    }), 201
