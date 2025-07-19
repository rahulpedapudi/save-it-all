
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

USER = os.getenv("MONGO_USER")
PASSWORD = os.getenv("MONGO_PASSWORD")

uri = f"mongodb+srv://{USER}:{PASSWORD}@save-it.p06pktm.mongodb.net/?retryWrites=true&w=majority&appName=save-it"

# Create a new client and connect to the server
client = MongoClient(uri)

db = client["save-it-db"]
links_collection = db["links"]

list_doc = list(links_collection.find({}))
print(list_doc)
