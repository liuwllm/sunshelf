from flask import Flask, Response, flash, request, redirect, url_for, jsonify
from flask_cors import CORS, cross_origin
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv
import json
from werkzeug.utils import secure_filename
from jpextract import *
from jmdictread import *
from bson.json_util import dumps
from bson.objectid import ObjectId

load_dotenv()
uri = os.getenv('MONGODB_URI')

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Successfully connected to DB!")
except Exception as e:
    print(e)

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['UPLOAD_FOLDER'] = './uploads'
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'epub'}

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def match(dictionary):
    megaList = []
    for word in dictionary:
        for entry in dictEntries:
            if word in entry['keb']:
                megaList.append(entry)
    print(megaList)
    return megaList

@app.route('/textupload', methods=['POST'])
@cross_origin()
def upload():
    db = client['jpdata']
    collection = db['books']
    
    f = request.files['file']
    savedPath = os.path.join(app.config['UPLOAD_FOLDER'], f.filename)
    f.save(savedPath)
    analysis = jpWordExtract(textExtract(savedPath))
    foundWords = match(analysis)
    
    title = request.form.get('title')

    dbEntry = {}
    dbEntry['words'] = foundWords
    dbEntry['title'] = title

    book = collection.insert_one(dbEntry)
    
    uploadResponse = {"_id": str(book.inserted_id)}

    collection = db['titles']

    collection.insert_one({'_id': str(book.inserted_id), 'title': dbEntry['title']})

    return Response(response=json.dumps(uploadResponse),
                    mimetype='application/json')

@app.route('/', methods=['GET'])
@cross_origin()
def render():
    db = client['jpdata']
    collection = db['titles']

    return Response(response=dumps(list(collection.find())),
                    mimetype='application/json')

@app.route('/worddata', methods=['GET'])
@cross_origin()
def getwords():
    db = client['jpdata']
    collection = db['books']

    wordId = ObjectId(request.args.get('_id'))
    
    return Response(response=dumps(collection.find_one({'_id': wordId})),
                    mimetype='application/json')