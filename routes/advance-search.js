const express = require('express');

const Model = require('../models/nhentai')['nhentai'];

const router = express.Router();

router.post('/', async (req, res) => {
	const json = req.body;

	let filter = {};

	if (json.term) {
		filter['$text'] = { $search: "\"" + json.term + "\"" };
	}

	if (json.tags) {
		filter['tags'] = { $all: JSON.parse(json.tags) };
	}

	if (json.characters) {
		filter['characters'] = { $all: JSON.parse(json.characters) };
	}

	if (json.parodies) {
		filter['parodies'] = json.parodies;
	}

	if (json.category) {
		filter['categories'] = json.category;
	}

	if (!Object.keys(filter).length && !term) {
		res.status(400).render('error', { title: 'request', errorCode: 400, error: 'Bad Request', message: '' });
		return;
	}

	req.session.filter = filter;
	req.session.term = json.term;

	let data = await Model.find(filter).sort({ _id: -1 }).limit(20),
		count = await Model.find(filter).count();

	res.status(200).render('list', {
		title: json.term ? `'${json.term}'` : 'Search',
		listTitle: `${count} results found`,
		data: data,
		page: Math.ceil(count/20),
		current: 1,
		url: `/advance-search`
	});
});

router.get('/page/:page', async (req, res) => {
	let filter = req.session.filter,
		term = req.session.term,
		page = req.params.page;

	let data = await Model.find(filter).sort({ _id: -1 }).skip((page - 1) * 20).limit(20),
		count = await Model.find(filter).count();

	res.status(200).render('list', {
		title: term ? `'${term}'` : 'Search',
		listTitle: `${count} results found`,
		data: data,
		page: Math.ceil(count/20),
		current: page,
		url: `/advance-search`
	});
});

module.exports = router;