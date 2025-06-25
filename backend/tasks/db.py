from pymongo import MongoClient


MONGO_URI = "mongodb://localhost:27017/"  # Your MongoDB connection string
DB_NAME = "py"  # The name of your database
COLLECTION_NAME = "links"

try:
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    print(
        f"Successfully connected to MongoDB and selected collection '{COLLECTION_NAME}'")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    exit()  # Exit if connection fails

update_result = collection.update_many(
    {},
    {
        "$set": {
            "content_type": ""
        }
    }
)

print(f"Matched {update_result.matched_count} document(s).")
print(f"Modified {update_result.modified_count} document(s).")
