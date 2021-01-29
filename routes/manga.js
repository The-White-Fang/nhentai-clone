const express = require('express');

const Model = require('../models/nhentai')['nhentai'];

const router = express.Router();

let getManga = async (req, res) => {
	let filter = {
		categories: 'manga'
	};

	let page = req.params.page || 1;

	let data = await Model.find(filter).sort({_id: -1}).skip((page - 1) * 20).limit(20),
		count = await Model.find(filter).count();

	res.status(200).render('list', {
		title: `Manga`,
		listTitle: `Manga: ${count}`,
		data: data,
		page: Math.ceil(count/20),
		current: page,
		url: `/manga`
	});
}

router.get('/', getManga);

router.get('/page/:page', getManga);

module.exports = router;