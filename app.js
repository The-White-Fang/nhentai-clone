const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs')

const exec = require('./functions/exec-promise');

const app = express();

// add middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: '0b1010011', resave: false, saveUninitialized: false, store: new session.MemoryStore() }));

// add static path
app.use(express.static('static'));

// set json indentation
app.set('json spaces', 4);

// set default view engine
app.set('view engine', 'ejs');

// import routes
const root = require('./routes/root');
const sauce = require('./routes/sauce');
const search = require('./routes/search');
const advanceSearch = require('./routes/advance-search');
const new_ = require('./routes/new');
const parodies = require('./routes/parodies');
const doujinshi = require('./routes/doujinshi');
const manga = require('./routes/manga');
const tags = require('./routes/tags');
const characters = require('./routes/characters');
const random = require('./routes/random');
const images = require('./routes/image');
const api = require('./routes/api');
const notFound = require('./routes/not-found');

// add routes to app
app.use('/', root);
app.use('/sauce', sauce);
app.use('/search', search);
app.use('/advance-search', advanceSearch);
app.use('/new', new_);
app.use('/parodies', parodies);
app.use('/doujinshi', doujinshi);
app.use('/manga', manga);
app.use('/tags', tags);
app.use('/characters', characters);
app.use('/random', random);
app.use('/getimage', images);
app.use('/api', api);
app.use('/', notFound); // should be at end

app.listen(3000, () => {
	console.log('Server Started');
});

setInterval(async  () => {
	let output, error;
	try {
		[output, error] = await exec('bash script.sh');
		if (!error) {
			fs.appendFile('update-log.txt', `${Date()}\n`, () => { console.log('UPDATED') } );
		}
	}
	catch (err) {
		fs.writeFile('error-log.txt', `${err.message}\n${err.stack}`, (e) => { if (e) console.log('failed to log error: ', err) });
	}

}, 60 * 60 * 1000);