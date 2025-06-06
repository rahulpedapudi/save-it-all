import os
import requests
from flask import request, jsonify
from functools import wraps
from jose import jwt
from jose.exceptions import JWTError

from dotenv import load_dotenv
load_dotenv()


JWKS_URL = "https://great-manatee-11.clerk.accounts.dev/.well-known/jwks.json"
# jwks = requests.get(JWKS_URL).json()

try:
    jwks = requests.get(JWKS_URL).json()
except Exception as e:
    jwks = {}
    print("Could not fetch JWKS", e)


CLERK_ISSUER = "https://great-manatee-11.clerk.accounts.dev"
CLERK_AUDIENCE = os.getenv("CLERK_FRONTEND_API")


def require_clerk_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header or not auth_header.startswith("Bearer"):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split("Bearer ")[1]

        try:
            unverified_header = jwt.get_unverified_header(token)
            rsa_key = None
            for key in jwks.get("keys", []):
                if key["kid"] == unverified_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"],
                    }
            if not rsa_key:
                return jsonify({"error": "Invalid Token"}), 401

            payload = jwt.decode(
                token, rsa_key, algorithms=["RS256"], audience=CLERK_AUDIENCE, issuer=CLERK_ISSUER)

            print(payload.items())

            request.user_id = payload.get("sub")
        except JWTError as e:
            return jsonify({"error": f"Token verification failed: {str( e)}"}), 401
        return f(*args, **kwargs)
    return decorated_function
