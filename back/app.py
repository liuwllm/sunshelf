from flask import Flask, Response, request, abort, redirect, render_template, session, url_for
from flask_cors import CORS, cross_origin

import pymongo
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

import os
from dotenv import load_dotenv

from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth

import json
from bson.json_util import dumps
from bson.objectid import ObjectId

from jpextract import *

from validate import validate_email_and_password, validate_user
from models import User
from auth_middleware import token_required

'''import psutil'''

# Initialize Flask App & CORS
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = './'
app.config['ALLOWED_EXTENSIONS'] = ['txt', 'pdf', 'epub']

# Retrieve env variables
load_dotenv()
uri = os.getenv('MONGODB_URI')
app.secret_key = os.getenv('APP_SECRET_KEY')

# Connect to MongoDB
client = MongoClient(uri, server_api=ServerApi('1'))
try:
    client.admin.command('ping')
    print("Successfully connected to DB!")
except Exception as e:
    print(e)


@app.route("/users/register", methods=["POST"])
def add_user():
    try:
        user = request.json
        if not user:
            return {
                "message": "Please provide user details",
                "data": None,
                "error": "Bad request"
            }, 400
        is_validated = validate_user(**user)
        if is_validated is not True:
            return {
                "message": "Invalid data", 
                "data": None, 
                "error": is_validated,
            }, 400
        user = User().create(**user)
        if not user:
            return {
                "message": "User already exists",
                "error": "Conflict",
                "data": None
            }, 409
        return {
            "message": "Successfully created new user",
            "data": user
        }, 201
    except Exception as e:
        return {
            "message": "Something went wrong",
            "error": str(e),
            "data": None
        }, 500

@app.route("/users/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data:
            return {
                "message": "Please provide user details",
                "data": None,
                "error": "Bad request"
            }, 400
        is_validated = validate_email_and_password(data.get('email'), data.get('password'))
        if is_validated is not True:
            return {
                "message": "Invalid data",
                "data": None,
                "error": is_validated
            }, 400
        user = User().login(
            data["email"],
            data["password"]
        )
        if user:
            try:
                user["token"] = jwt.encode(
                    {"user_id": user["_id"]},
                    app.config["APP_SECRET_KEY"],
                    algorithm="HS256"
                )
                return {
                    "message": "Successfully fetched auth token",
                    "data": user
                }
            except Exception as e:
                return {
                    "error": "Something went wrong",
                    "message": str(e)
                }, 500
        return {
            "message": "Error fetching auth token! Invalid email or password.",
            "data": None,
            "error": "Unauthorized"
        }, 404
    except Exception as e:
        return {
            "message": "Something went wrong!",
            "error": str(e),
            "data": None
        }, 500

# Connect to kebLookup collection in MongoDB to create indexes
db = client['jpdata']
collection = db['kebLookup']

collection.create_index([('keb', pymongo.ASCENDING)], name='search_index')

# Defines allowed file types
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Matches words from text to dictionary keys
def match(words):
    db = client['jpdata']
    collection = db['kebLookup']
    
    megaList = []
    foundWords = {}

    for word in words:
        # Skips searching JMDict if word has already been found
        if word in foundWords:
            continue
        
        # Search JMDict for word
        matchingResult = collection.find_one({"keb": word})
        foundWords[word] = True
        
        if matchingResult == None:
            continue
        
        for id in matchingResult['idList']:
            megaList.append(id)
    
    # Returns list of all IDs for words found
    return megaList

@app.route('/textupload', methods=['POST'])
@cross_origin()
def upload():
    '''
    process = psutil.Process() #initiate only once
    memory_info = process.memory_info()
    rss = memory_info.rss
    rss_mb = rss / (1024 * 1024)
    print(f"Memory usage: {rss_mb} MB")
    '''

    db = client['jpdata']
    collection = db['books']
    
    f = request.files['file']
    
    if allowed_file(f.filename) == False:
        abort(500, 'Unsupported file type')
        
    savedPath = os.path.join(app.config['UPLOAD_FOLDER'], f.filename)
    
    f.save(savedPath)
    
    analysis = jpWordExtract(textExtract(savedPath))
    foundWordIds= match(analysis)

    os.remove(savedPath)
    
    title = request.form.get('title')

    dbEntry = {}
    dbEntry['words'] = foundWordIds
    dbEntry['title'] = title
    dbEntry['_id'] = str(ObjectId())

    book = collection.insert_one(dbEntry)

    uploadResponse = {"_id": book.inserted_id}

    return Response(response=json.dumps(uploadResponse),
                    mimetype='application/json')

@app.route('/', methods=['GET'])
@cross_origin()
@token_required
def render(current_user):
    db = client['jpdata']
    collection = db['books']
    return Response(response=dumps(list(collection.find({},{"title":1}))),
                    mimetype='application/json')

@app.route('/worddata', methods=['GET'])
@cross_origin()
def getwords():
    db = client['jpdata']
    collection = db['books']

    bookId = request.args.get('_id')
    offset = int(request.args.get('offset'))

    book = collection.find_one({'_id': bookId})

    result = {
        'title': book['title'],
        'words': []
    }

    jmdict = db['jmdict']

    numberOfWords = len(book['words'])

    for i in range(0 + offset, 20 + offset):
        if i > numberOfWords:
            break
        result['words'].append(jmdict.find_one({ "id": book['words'][i] }))


    return Response(response=dumps(result),
                    mimetype='application/json')

'''
@app.route('/update', methods=['PUT'])
@cross_origin()
def rename():
    db = client['jpdata']
    collection = db ['books']
'''