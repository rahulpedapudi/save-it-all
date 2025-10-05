"""Notes: standard → third-party → local 😅 """
from datetime import datetime
from urllib.parse import urlparse

from flask import request, jsonify, Blueprint, current_app
from bson.objectid import ObjectId
from pymongo.errors import DuplicateKeyError
from werkzeug.exceptions import BadRequest, NotFound

from tasks import summarization
from tasks import content_extract
from .google_auth import require_google_auth
from tasks.link_tasks import enrich_link_task


# blueprint
api_bp = Blueprint('api', __name__)


@api_bp.route("/health", methods=["GET"])
def api_health():
    return jsonify({"status": "running"}), 201


# endpoint for saving the link, used in browser extension only
@api_bp.route("/save", methods=["POST"])
@require_google_auth
def save_data():
    mongo = current_app.mongo
    data = request.get_json()
    user_id = request.user_id

    # Validate request data
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    required_fields = ['url', 'id', 'title', 'tags', 'note', 'save_type']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    url = data['url']

    # Validate URL
    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        parsed_url = urlparse(url)
        domain_name = parsed_url.netloc.lower()

        # Handle cases where domain might not have expected structure
        if '.' in domain_name:
            # extracting the xyz from www.xyz.com
            parts = domain_name.split('.')
            if len(parts) >= 2:
                # Remove www. if present and get the main domain
                if parts[0] == 'www' and len(parts) > 2:
                    domain_name = parts[1]
                else:
                    domain_name = parts[0]
            else:
                domain_name = domain_name.replace('www.', '')
        else:
            domain_name = domain_name.replace('www.', '')
    except Exception as e:
        return jsonify({"error": f"Invalid URL format: {str(e)}"}), 400

    link = {
        "user_id": user_id,
        "title": data['title'],
        "url": url,
        "tags": [domain_name] + (data['tags'] if data['tags'] else []),
        "domain": domain_name,
        "summary": "",
        "note": data['note'],
        # save type stores whether is a full page save or a selected text save.
        "save_type": data['save_type'],
        # content type stores whether the save is an artilce, note, video, tweet etc..
        "content_type": "",  # TODO: store the respective content type when saving
        "selected_text": data.get('selected_text', ""),
        "is_favorite": False,
        "folder_id": "",
        "status": "pending",
        "created_at": datetime.now().isoformat()
    }

    try:
        # Check if link already exists for this user
        existing_link = mongo.db.links.find_one({
            "user_id": user_id,
            "url": url,
            "save_type": data['save_type']
        })

        if existing_link:
            return jsonify({"error": "Link already exists"}), 409

        # Insert the new link
        result = mongo.db.links.insert_one(link)
        link['_id'] = str(result.inserted_id)

        # background tasks
        enrich_link_task.delay(str(result.inserted_id))

        return jsonify({"message": "Link saved successfully", "link": link}), 201

    except DuplicateKeyError:
        return jsonify({"error": "Link already exists"}), 409
    except Exception as e:
        return jsonify({"error": f"Failed to save link: {str(e)}"}), 500


@api_bp.route("/links", methods=["GET"])
@require_google_auth
def get_links():
    mongo = current_app.mongo
    user_id = request.user_id

    # Get query parameters
    tags = request.args.getlist('tags')
    search = request.args.get('search', '')

    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    skip = (page - 1) * limit

    collection = mongo.db.links

    total = collection.count_documents({})

    # Build query
    query = {"user_id": user_id}

    if tags:
        query["tags"] = {"$in": tags}

    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"url": {"$regex": search, "$options": "i"}},
            {"note": {"$regex": search, "$options": "i"}}
        ]

    try:
        links = list(collection.find(query).sort(
            "created_at", -1).skip(skip).limit(limit))

        # Convert ObjectId to string for JSON serialization
        for link in links:
            link['_id'] = str(link['_id'])

        return jsonify({"page": page, "limit": limit, "total": total, "pages": (total + limit - 1) // limit, "links": links}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to fetch links: {str(e)}"}), 500


@api_bp.route("/links/<link_id>", methods=["GET"])
@require_google_auth
def get_link(link_id):
    mongo = current_app.mongo
    user_id = request.user_id

    try:
        # Verify the link belongs to the user and get it
        link = mongo.db.links.find_one(
            {"_id": ObjectId(link_id), "user_id": user_id})

        if not link:
            return jsonify({"error": "Link not found"}), 404

        # Convert ObjectId to string for JSON serialization
        link['_id'] = str(link['_id'])

        return jsonify(link), 200

    except Exception as e:
        return jsonify({"error": f"Failed to fetch link: {str(e)}"}), 500


@api_bp.route("/links/<link_id>", methods=["DELETE"])
@require_google_auth
def delete_link(link_id):
    mongo = current_app.mongo
    user_id = request.user_id

    try:
        # Verify the link belongs to the user
        link = mongo.db.links.find_one(
            {"_id": ObjectId(link_id), "user_id": user_id})
        if not link:
            raise NotFound("Link not found")

        # Delete the link
        result = mongo.db.links.delete_one(
            {"_id": ObjectId(link_id), "user_id": user_id})

        if result.deleted_count == 0:
            raise NotFound("Link not found")

        return jsonify({"message": "Link deleted successfully"}), 200

    except NotFound as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to delete link: {str(e)}"}), 500


@api_bp.route("/links/<link_id>", methods=["PATCH"])
@require_google_auth
def update_link(link_id):
    mongo = current_app.mongo
    user_id = request.user_id
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    try:
        # Verify the link belongs to the user
        link = mongo.db.links.find_one(
            {"_id": ObjectId(link_id), "user_id": user_id})
        if not link:
            raise NotFound("Link not found")

        # Delete the link
        result = mongo.db.links.update_one(
            {"_id": ObjectId(link_id), "user_id": user_id}, {"$set": data})

        if result.matched_count == 0:
            raise NotFound("Link not found")

        return jsonify({"message": "Link updated successfully"}), 200

    except NotFound as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to update link: {str(e)}"}), 500


@api_bp.route("/link/<link_id>/assign-folder", methods=["PATCH"])
@require_google_auth
def assign_folder(link_id):
    mongo = current_app.mongo
    user_id = request.user_id
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    folder_id = data.get('folder_id')
    if not folder_id:
        return jsonify({"error": "folder_id is required"}), 400

    try:
        # Verify the link belongs to the user
        link = mongo.db.links.find_one(
            {"_id": ObjectId(link_id), "user_id": user_id})
        if not link:
            raise NotFound("Link not found")

        # Update the link with folder_id
        result = mongo.db.links.update_one(
            {"_id": ObjectId(link_id), "user_id": user_id},
            {"$set": {"folder_id": folder_id}}
        )

        if result.modified_count == 0:
            raise NotFound("Link not found")

        return jsonify({"message": "Folder assigned successfully"}), 200

    except NotFound as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to assign folder: {str(e)}"}), 500


@api_bp.route("/analyze/<link_id>", methods=["GET"])
@require_google_auth
def analyze_link(link_id):
    mongo = current_app.mongo
    user_id = request.user_id

    try:
        # Verify the link belongs to the user
        link = mongo.db.links.find_one(
            {"_id": ObjectId(link_id), "user_id": user_id})

        if not link:
            return jsonify({"error": "Link not found"}), 404

        print("Analyzing link:", link)
        # TODO: Implement actual summarization logic here
        # For now, we'll just return a placeholder message
        # In the future, this should call the summarization task
        enrich_link_task.delay(str(link_id))

        return jsonify({"message": "Analysis started"}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to analyze link: {str(e)}"}), 500


@api_bp.route("/fav/<link_id>", methods=["GET"])
@require_google_auth
def favorite_link(link_id):
    mongo = current_app.mongo
    user_id = request.user_id
    if not link_id:
        return jsonify({"error": "link_id is required"}), 400
    try:
        # Verify the link belongs to the user
        link = mongo.db.links.find_one(
            {"_id": ObjectId(link_id), "user_id": user_id})
        if not link:
            raise NotFound("Link not found")

        # Toggle favorite
        new_favorite_status = not link.get("is_favorite", False)

        result = mongo.db.links.update_one(
            {"_id": ObjectId(link_id), "user_id": user_id},
            {"$set": {"is_favorite": new_favorite_status}}
        )

        if result.modified_count == 0:
            raise NotFound("Link not found")

        return jsonify({"message": "Link favorite status updated successfully"}), 200

    except NotFound as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to update favorite status: {str(e)}"}), 500


@api_bp.route("/save-note", methods=["POST"])
@require_google_auth
def save_note():
    mongo = current_app.mongo
    user_id = request.user_id
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    if "content" not in data:
        return jsonify({"error": "content is required"}), 400

    note = {
        "user_id": user_id,
        "title": data.get("title", ""),
        "content": data["content"],
        "tags": ["notes"] + (data.get("tags", []) if data.get("tags") else []),
        "content_type": "note",
        "folder_id": data.get("folder_id", ""),
        "summary": "",
        "is_favorite": False,
        "created_at": datetime.now().isoformat(),
    }

    try:
        result = mongo.db.links.insert_one(note)
        print("Data Received: ", note)
        return jsonify({
            "status": "success",
            "inserted_id": str(result.inserted_id),
            "received": note
        }), 201
    except Exception as e:
        print("Error: ", e)
        return jsonify({"status": "failed", "error": str(e)}), 500
        
