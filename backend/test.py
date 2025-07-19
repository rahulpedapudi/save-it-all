from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
print(client.list_database_names())
