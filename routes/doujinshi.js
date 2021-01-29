const express = require('express');

const Model = require('../models/nhentai')['nhentai'];

const router = express.Router();

let getDoujinshi = async (req, res) => {
	let filter = {
		categories: 'doujinshi'
	};

	let page = req.params.page || 1;

	let data = await Model.find(filter).sort({_id: -1}).skip((page - 1) * 20).limit(20),
		count = await Model.find(filter).count();

	res.status(200).render('list', {
		title: `Doujinshi`,
		listTitle: `Doujinshi: ${count}`,
		data: data,
		page: Math.ceil(count/20),
		current: page,
		url: `/doujinshi`
	});
}

router.get('/', getDoujinshi);

router.get('/page/:page', getDoujinshi);

module.exports = router;