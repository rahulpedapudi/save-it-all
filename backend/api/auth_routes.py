from flask import Blueprint, request, jsonify, redirect, current_app
from flask_cors import cross_origin
from .google_auth import (
    get_google_auth_url,
    exchange_code_for_token,
    save_or_update_user,
    create_jwt_token,
    verify_jwt_token
)

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/google/login", methods=["GET"])
@cross_origin()
def google_login():
    """Initiate Google OAuth login"""
    try:
        auth_url = get_google_auth_url()
        return jsonify({"auth_url": auth_url}), 200
    except Exception as e:
        print(f"Error generating auth URL: {e}")
        return jsonify({"error": f"Failed to generate auth URL: {str(e)}"}), 500


@auth_bp.route("/google/callback", methods=["GET"])
@cross_origin()
def google_callback():
    """Handle Google OAuth callback"""
    try:
        code = request.args.get('code')
        if not code:
            print("No authorization code provided")
            return jsonify({"error": "Authorization code not provided"}), 400

        print(f"Received authorization code: {code[:20]}...")

        # Exchange code for user info
        user_info = exchange_code_for_token(code)
        if not user_info:
            print("Failed to exchange code for user info")
            return jsonify({"error": "Failed to exchange code for token"}), 400

        print(
            f"Successfully got user info for: {user_info.get('email', 'unknown')}")

        # Save or update user in database
        db_user_id = save_or_update_user(user_info)
        print(f"User saved/updated in database with ID: {db_user_id}")

        # Create JWT token
        token = create_jwt_token(
            user_id=user_info['user_id'],
            email=user_info['email'],
            name=user_info['name'],
            picture=user_info['picture']
        )

        print("JWT token created successfully")

        # Redirect to frontend with token
        frontend_url = current_app.config['FRONTEND_URL']
        redirect_url = f"{frontend_url}/auth/callback?token={token}"
        print(f"Redirecting to: {redirect_url}")

        return redirect(redirect_url)

    except Exception as e:
        print(f"Error in Google callback: {e}")
        import traceback
        traceback.print_exc()
        frontend_url = current_app.config['FRONTEND_URL']
        return redirect(f"{frontend_url}/auth/error?error={str(e)}")


@auth_bp.route("/verify", methods=["GET"])
@cross_origin()
def verify_token():
    """Verify JWT token and return user info"""
    try:
        auth_header = request.headers.get("Authorization", None)
        if not auth_header or not auth_header.startswith("Bearer"):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split("Bearer ")[1]
        payload = verify_jwt_token(token)

        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        return jsonify({
            "user_id": payload.get('user_id'),
            "email": payload.get('email'),
            "name": payload.get('name'),
            "picture": payload.get('picture')
        }), 200

    except Exception as e:
        return jsonify({"error": f"Token verification failed: {str(e)}"}), 401


@auth_bp.route("/logout", methods=["POST"])
@cross_origin()
def logout():
    """Logout endpoint (client-side token removal)"""
    return jsonify({"message": "Logged out successfully"}), 200
