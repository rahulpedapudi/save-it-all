import os
import jwt
import requests
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app, redirect, url_for
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
import json

# Google OAuth configuration
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


def create_jwt_token(user_id, email, name, picture):
    """Create a JWT token for the user"""
    payload = {
        'user_id': user_id,
        'email': email,
        'name': name,
        'picture': picture,
        'exp': datetime.utcnow() + timedelta(hours=current_app.config['JWT_EXPIRATION_HOURS']),
        'iat': datetime.utcnow()
    }

    token = jwt.encode(
        payload,
        current_app.config['JWT_SECRET_KEY'],
        algorithm=current_app.config['JWT_ALGORITHM']
    )
    return token


def verify_jwt_token(token):
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET_KEY'],
            algorithms=[current_app.config['JWT_ALGORITHM']]
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def require_google_auth(f):
    """Decorator to require Google OAuth authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header or not auth_header.startswith("Bearer"):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split("Bearer ")[1]
        payload = verify_jwt_token(token)

        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Add user info to request
        request.user_id = payload.get('user_id')
        request.user_email = payload.get('email')
        request.user_name = payload.get('name')
        request.user_picture = payload.get('picture')

        return f(*args, **kwargs)
    return decorated_function


def get_google_auth_url():
    """Generate Google OAuth URL"""
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": current_app.config['GOOGLE_CLIENT_ID'],
                "client_secret": current_app.config['GOOGLE_CLIENT_SECRET'],
                "auth_uri": GOOGLE_AUTH_URL,
                "token_uri": GOOGLE_TOKEN_URL,
                "redirect_uris": [current_app.config['GOOGLE_REDIRECT_URI']],
                "scopes": ["openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
            }
        },
        scopes=["openid", "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile"]
    )

    flow.redirect_uri = current_app.config['GOOGLE_REDIRECT_URI']
    auth_url, _ = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    return auth_url


def exchange_code_for_token(code):
    """Exchange authorization code for access token and user info"""
    try:
        # Create a new flow instance for token exchange
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": current_app.config['GOOGLE_CLIENT_ID'],
                    "client_secret": current_app.config['GOOGLE_CLIENT_SECRET'],
                    "auth_uri": GOOGLE_AUTH_URL,
                    "token_uri": GOOGLE_TOKEN_URL,
                    "redirect_uris": [current_app.config['GOOGLE_REDIRECT_URI']],
                    "scopes": ["openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
                }
            },
            scopes=["openid", "https://www.googleapis.com/auth/userinfo.email",
                    "https://www.googleapis.com/auth/userinfo.profile"]
        )

        flow.redirect_uri = current_app.config['GOOGLE_REDIRECT_URI']

        # Fetch token with the authorization code
        flow.fetch_token(code=code)
        credentials = flow.credentials

        # Get user info from Google
        userinfo_response = requests.get(
            GOOGLE_USERINFO_URL,
            headers={'Authorization': f'Bearer {credentials.token}'}
        )

        if userinfo_response.status_code != 200:
            print(f"Error getting user info: {userinfo_response.status_code}")
            return None

        userinfo = userinfo_response.json()

        return {
            'user_id': userinfo['id'],
            'email': userinfo['email'],
            'name': userinfo.get('name', ''),
            'picture': userinfo.get('picture', ''),
            'verified_email': userinfo.get('verified_email', False)
        }
    except Exception as e:
        print(f"Error exchanging code for token: {e}")
        return None


def save_or_update_user(user_info):
    """Save or update user in database"""
    mongo = current_app.mongo

    # Check if user exists
    existing_user = mongo.db.users.find_one(
        {"google_id": user_info['user_id']})

    if existing_user:
        # Update existing user
        mongo.db.users.update_one(
            {"google_id": user_info['user_id']},
            {
                "$set": {
                    "email": user_info['email'],
                    "name": user_info['name'],
                    "picture": user_info['picture'],
                    "verified_email": user_info['verified_email'],
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return existing_user['_id']
    else:
        # Create new user
        new_user = {
            "google_id": user_info['user_id'],
            "email": user_info['email'],
            "name": user_info['name'],
            "picture": user_info['picture'],
            "verified_email": user_info['verified_email'],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = mongo.db.users.insert_one(new_user)
        return result.inserted_id
