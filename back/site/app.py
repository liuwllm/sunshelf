from flask import Flask, Response, flash, request, redirect, url_for
from flask_cors import CORS, cross_origin
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv
import json
from werkzeug.utils import secure_filename
from jpextract import *

load_dotenv()
uri = os.getenv('MONGODB_URI')

client = MongoClient(uri, server_api=ServerApi('1'))


try:
    client.admin.command('ping')
    print("Successfully connected to DB!")
except Exception as e:
    print(e)


db = client['jpdata']
collection = db['jpwords']

'''
file = open('jmdict.json')
data = json.load(file)

collection.delete_many({ })
x = collection.insert_many(data)
'''

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/')
@cross_origin()
def base():
    return Response(response=json.dumps({"Status": "UP"}),
                    status=200,
                    mimetype='application/json')

app.config['UPLOAD_FOLDER'] = './uploads'
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'epub'}

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/textupload', methods=['POST'])
@cross_origin()
def upload():
    f = request.files['file']
    savedPath = os.path.join(app.config['UPLOAD_FOLDER'], f.filename)
    f.save(savedPath)
    analysis = jpWordExtract(textExtract(savedPath))
    return Response(response=json.dumps(analysis),
                    mimetype='application/json')
