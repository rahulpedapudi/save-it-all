from flask import request, jsonify, Blueprint, current_app
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from datetime import datetime
from tasks import tag_extraction

# blueprint
api_bp = Blueprint('api', __name__)


# endpoint for saving the link, used in browser extension only
@api_bp.route("/save", methods=["POST"])
def save_data():
    mongo = current_app.mongo
    data = request.json
    id = data['id']
    url = data['url']
    title = data['title']

    link = {
        "tab_id": id,
        "title": title,
        "url": url,
        "tags": [],
        "created_at": datetime.now().isoformat()
    }

    link['tags'] = tag_extraction.generate_tags(link["url"])

    # only inserting unique links, throws and error if link already saved
    # ? do we need to accept duplicates?
    try:
        result = mongo.db.links.insert_one(link)
        print("Data Received", link)
        return jsonify({
            "status": "success",
            "inserted_id": str(result.inserted_id),
            "received": link
        }), 201
    except DuplicateKeyError:
        return jsonify({
            "status": "duplicate",
            "message": "This URL is already saved."
        }), 409


# endpoint to get all the posts in the database
@api_bp.route("/links", methods=["GET"])
def get_links():
    mongo = current_app.mongo
    links = list(mongo.db.links.find({}))
    # Convert _id to string
    for link in links:
        link["_id"] = str(link["_id"])
    return jsonify(links)


# ? how can we do this?
@api_bp.route("/analyze/<int:id>", methods=["GET"])
def get_analyzed_post(id):
    pass


# endpoint for getting a particular link using the objectId, and also for delete the link from the database using the objectId
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
