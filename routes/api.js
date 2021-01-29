const express = require('express');

const router = express.Router();

const Model = require('../models/nhentai')['nhentai'];

router.get('/tags', async (req, res) => {
	let data = await Model.distinct('tags').sort();
	// remove null values if any
	data = data.filter(x => x);

	res.status(200).json(data);
});

router.get('/characters', async (req, res) => {
	let data = await Model.distinct('characters').sort();
	//remove null values if any
	data = data.filter(x => x);

	res.status(200).json(data);
});

router.get('/parodies', async (req, res) => {
	let data = await Model.distinct('parodies').sort();
	//remove null values if any
	data = data.filter(x => x);

	res.status(200).json(data);
});

module.exports = router;