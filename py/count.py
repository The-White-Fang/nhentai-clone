import requests
import pymongo
import json
from urllib.parse import quote

def connect():
	file = open('../credentials.json', 'r')
	cred = json.load(file)
	connection = "mongodb://"
	connection+= cred['username'] + ':'
	connection+= quote(cred['password']) + '@'
	connection+= cred['host'] + '/'
	connection+= '?authSource=' + cred['authSource']
	
	client = pymongo.MongoClient(connection)
	
	return client[cred['database']]

db = connect()

obj = db.nhentai.find({}, { '_id': 0, 'cover': 1})

size = 0

for o in obj:
	url = o['cover']
	print(url)
	size += len(requests.get(url).text)
	print((size/1024)/1024)