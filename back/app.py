from flask import Flask, Response, request, abort, redirect, render_template, session, url_for
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

# Defines allowed file types
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def match(dictionary):
    megaList = []
    for word in dictionary:
        if word in kebLookup:
            for id in kebLookup[word]:
                megaList.append(id)
    print(megaList)
    return megaList

@app.route('/textupload', methods=['POST'])
@cross_origin()
def upload():
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

    for i in range(0 + offset, 20 + offset):
        result['words'].append(idLookup[book['words'][i]])

    return Response(response=dumps(result),
                    mimetype='application/json')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=10000)