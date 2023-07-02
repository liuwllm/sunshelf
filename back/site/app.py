from flask import Flask, Response
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv
import json

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

file = open('jmdict.json')
data = json.load(file)

x = collection.insert_many(data)

app = Flask(__name__)

@app.route('/')
def base():
    return Response(response=json.dumps({"Status": "UP"}),
                    status=200,
                    mimetype='application/json')

'''
@app.route('/dbupload', methods=['POST'])
def upload():
    data = request.json
    collection.insert_one(data)
    return 'Data added'
'''

if __name__ == '__main__':
    app.run(debug=True, port=3000, host='0.0.0.0')
