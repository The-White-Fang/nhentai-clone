#!/usr/bin/env python3.7
import requests
from bs4 import BeautifulSoup as BS
import re
import datetime
import json
import pymongo
from urllib.parse import quote
import os

def getSitemaps():
	resp = requests.get('https://static.nhentai.net/sitemap.xml')
	
	if (resp.status_code != 200):
		return 0
	
	bs = BS(resp.text, 'html.parser')
	sitemaps = bs.find_all('sitemap')
	sitemaps = filter(lambda x: 'galleries' in x.text, sitemaps)
	sitemaps = [sitemap.text for sitemap in sitemaps]

	return sitemaps



def getLinks(sitemap):
	resp = requests.get(sitemap)
	
	if (resp.status_code != 200):
		return 0
	
	bs = BS(resp.text, 'html.parser')
	locs = bs.find_all('loc')
	
	locs = [loc.text for loc in locs]
	
	return locs



def getData(url):
	resp = requests.get(url)
	
	if (resp.status_code != 200):
		return 0
	
	bs = BS(resp.text, 'html.parser')
	
	data = {}
	
	data['sauce'] = int(re.search(re.compile(r'\d+'), url).group())
	data['cover'] = bs.find('div', {'id': 'cover'}).find('img')['data-src']

	info = bs.find('div', {'id': 'info'})

	title = info.find('h1', {'class': 'title'})
	data['meta-title'] = title.find('span', {'class': 'before'}).text
	data['title'] = title.find('span', {'class': 'pretty'}).text
	data['post-title'] = title.find('span', {'class': 'after'}).text

	tags = info.find('section', {'id': 'tags'})
	tags = tags.select('div.tag-container')
	for tag in tags:
		key = tag.find(text=True).strip().replace(':', '').lower()
		if key == 'pages':
			data[key] = int(tag.find('span', {'class': 'tags'}).text)
			continue
		elif key == 'uploaded':
			data[key] = datetime.datetime.fromisoformat(tag.find('time')['datetime']).timestamp()
			continue
		val = [t.text for t in tag.find_all('span', {'class': 'name'})]
		data[key] = val
			
	return data



def log(arg):
	file = open('log.txt', 'w')
	file.write(str(arg))
	file.close()



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



def insert(db, obj):
	collection = db['nhentai']
	collection.insert_one(obj)



def configure_dir():
	dir_path = os.path.dirname(os.path.realpath(__file__))
	os.chdir(dir_path)

	

def main():
	sitemaps = getSitemaps()
	
	file = open('log.txt', 'r')
	skip = int(file.read())
	file.close()

	nhentai = connect()

	for sitemap in sitemaps:
		urls = getLinks(sitemap)

		for url in urls:
			num = int(re.search(re.compile(r'\d+'), url).group())

			if num <= skip:
				continue

			data = getData(url)
			if not data:
				continue
			insert(nhentai, data)
			log(num)



if __name__ == '__main__':
	configure_dir()
	main()