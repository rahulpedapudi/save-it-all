from flask import request, jsonify, Blueprint, current_app
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from datetime import datetime
from tasks import summarization
from tasks import content_extract
from werkzeug.exceptions import BadRequest, NotFound
from urllib.parse import urlparse

from .auth import require_clerk_auth

# blueprint
api_bp = Blueprint('api', __name__)


# endpoint for saving the link, used in browser extension only
@api_bp.route("/save", methods=["POST"])
@require_clerk_auth
def save_data():
    mongo = current_app.mongo
    data = request.json
    user_id = request.user_id

    url = data['url']
    domain_name = urlparse(url).netloc.lower()

    # extracting the xyz from www.xyz.com
    domain_name = domain_name[domain_name.index(
        '.') + 1: domain_name.rindex('.')]

    link = {
        "user_id": user_id,
        "tab_id": data['id'],
        "title": data['title'],
        "url": url,
        "tags": [domain_name] + data['tags'],
        "domain": domain_name,
        "summary": "",
        "note": data['note'],
        "save_type": data['save_type'],
        "selected_text": data.get('selected_text', ""),
        "is_favorite": False,
        "created_at": datetime.now().isoformat()
    }

    # only inserting unique links, throws and error if link already saved
    try:
        result = mongo.db.links.insert_one(link)
        print("Data Received", link)
        return jsonify({
            "status": "success",
            "inserted_id": str(result.inserted_id),
            "received": link
        }), 201
    # TODO: i should merge update the existing record if the user first saved selected text and later chooses to save the full page...
    except DuplicateKeyError:
        return jsonify({
            "status": "duplicate",
            "message": "This URL is already saved."
        }), 409


# endpoint to get all the posts in the database
@api_bp.route("/links", methods=["GET"])
@require_clerk_auth
def get_links():
    mongo = current_app.mongo
    user_id = request.user_id

    tags = request.args.getlist("tags")
    tags = [tag.lower() for tag in tags]

    query = {"user_id": user_id}

    if tags:
        query["tags"] = {"$in": tags}

    links = list(mongo.db.links.find(query).sort("created_at", -1))

    if not links:
        return jsonify({"links": [], "message": "No posts found."}), 200

    # Convert _id to string
    for link in links:
        link["_id"] = str(link["_id"])

    return jsonify({"links": links}), 200


# endpoint to call the gemini api to summarise the post and update the summarised content in the database
@api_bp.route("/analyze/<id>", methods=["GET"])
# @require_clerk_auth
def get_analyzed_post(id):
    try:
        mongo = current_app.mongo
        post = mongo.db.links.find_one({"_id": ObjectId(id)})
        if not post:
            return jsonify({"error": "Post Not Found"}), 404

        # get html content by passing the url
        content = content_extract.get_content(post['url'])

        if content:
            # passing the content to the gemini api to get the actual summarisation
            summary = summarization.summarise(content)

            # update the database; summary and tags.
            mongo.db.links.update_one(
                {"_id": ObjectId(id)},
                {"$set": {
                    "summary": summary['summary'],
                    "tags": post["tags"] + summary['tags']
                }}
            )
            return jsonify({"message": "Summary Updated", "summary": summary}), 200
        else:
            return jsonify({"message": "Error Extracting the content", "summary": None}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# endpoint for getting a particular link using the objectId, and also for delete the link from the database using the objectId
@api_bp.route("/links/<id>", methods=["GET", "DELETE"])
# @require_clerk_auth
def handle_link(id):
    mongo = current_app.mongo
    if request.method == 'GET':
        link = mongo.db.links.find_one(
            {"_id": ObjectId(id)})
        if link:
            link["_id"] = str(link["_id"])
            return jsonify(link)
        return jsonify({"error": "Link not Found!"}), 404
    if request.method == 'DELETE':
        res = mongo.db.links.delete_one(
            {"_id": ObjectId(id)})
        if res.deleted_count == 1:
            return jsonify({"message": "deleted successfully"}), 200
        else:
            return jsonify({"error": "Link not found"}), 404


@api_bp.route("/link/<id>", methods=["PATCH"])
# @require_clerk_auth
def update_link(id):
    mongo = current_app.mongo
    try:
        updated_data = request.get_json()
        if not updated_data:
            raise BadRequest("No data provided for update")
        result = mongo.db.links.update_one({"_id": ObjectId(id)}, {
            "$set": updated_data
        })

        if result.matched_count == 0:
            raise NotFound(f"No document found with id: {id}")

        return jsonify({"message": "Document updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
