import os
import requests
from flask import request, jsonify
from functools import wraps
from jose import jwt
from jose.exceptions import JWTError

from dotenv import load_dotenv
load_dotenv()

# This endpoint provides the public keys that Clerk uses to sign its JWTs.
JWKS_URL = os.getenv("JWKS_URL")

CLERK_ISSUER = os.getenv("CLERK_ISSUER")
CLERK_AUDIENCE = os.getenv("CLERK_FRONTEND_API")

# Attempt to fetch the JWKS from the provided URL.


def get_jwks():
    try:
        jwks = requests.get(JWKS_URL).json()
    except Exception as e:
        jwks = {}
        print("Could not fetch JWKS", e)
    finally:
        return jwks


def find_rsa_key(token_kid, jwks):
    for key in jwks.get("keys", []):
        if key["kid"] == token_kid:
            return {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
    return None


def require_clerk_auth(f):
    """
    A decorator for Flask routes that enforces authentication using Clerk.dev JWTs.
    It verifies the JWT received in the Authorization header of the request.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get the Authorization header from the incoming request.
        auth_header = request.headers.get("Authorization", None)
        if not auth_header or not auth_header.startswith("Bearer"):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        # Extract the actual JWT string by splitting the header.
        token = auth_header.split("Bearer ")[1]

        try:
            unverified_header = jwt.get_unverified_header(token)
            rsa_key = find_rsa_key(unverified_header["kid"], get_jwks())

            if not rsa_key:
                return jsonify({"error": "Invalid Token"}), 401

            #  Decode and verify the JWT.
            payload = jwt.decode(
                token, rsa_key, algorithms=["RS256"], audience=CLERK_AUDIENCE, issuer=CLERK_ISSUER)

            # Extract the user_id from the token's payload
            request.user_id = payload.get("sub")

        except JWTError as e:
            return jsonify({"error": f"Token verification failed: {str( e)}"}), 401
        return f(*args, **kwargs)
    return decorated_function
