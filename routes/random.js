const express = require('express');

const Model = require('../models/nhentai')['nhentai'];
const random = require('../functions/random-doc');

const router = express.Router();

router.get('/', async (req, res) => {
	let data = await random(Model, 20);

	res.status(200).render('list', {
		title: `Random`,
		listTitle: `Random Suggestions`,
		data: data,
		url: `/random`
	});
});

module.exports = router;