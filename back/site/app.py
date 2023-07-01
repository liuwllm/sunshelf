from flask import Flask
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
mongoDBPassword = os.getenv('MONGODB_PASSWORD')

app = Flask(__name__)

client = MongoClient('localhost', 3000, username='liuwllm', password=)