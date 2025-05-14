from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api/save", methods=["POST"])
def save_data():
    data = request.json
    print("Data Received", data)
    return jsonify({"status": "success", "received": data}), 200


if __name__ == '__main__':
    app.run(port=5000, debug=True)
