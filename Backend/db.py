import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"), serverSelectionTimeoutMS=5000)
db = client["algomind_db"]
resumes_col = db["resumes"]
analyses_col = db["analyses"]