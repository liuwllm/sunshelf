from flask import Flask, Response, request, abort
from flask_cors import CORS, cross_origin
import pymongo
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv
import json
from werkzeug.utils import secure_filename
from jpextract import *
from bson.json_util import dumps
from bson.objectid import ObjectId

'''import psutil'''

load_dotenv()
uri = os.getenv('MONGODB_URI')

# Connect to MongoDB
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Successfully connected to DB!")
except Exception as e:
    print(e)

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = './'
app.config['ALLOWED_EXTENSIONS'] = ['txt', 'pdf', 'epub']

db = client['jpdata']
collection = db['kebLookup']

collection.create_index([('keb', pymongo.ASCENDING)], name='search_index')

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def match(words):
    db = client['jpdata']
    collection = db['kebLookup']
    
    megaList = []
    foundWords = {}

    for word in words:
        if word in foundWords:
            continue
        
        matchingResult = collection.find_one({"keb": word})
        foundWords[word] = True
        
        if matchingResult == None:
            continue
        
        for id in matchingResult['idList']:
            megaList.append(id)
    
    print(megaList)
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
def render():
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
    