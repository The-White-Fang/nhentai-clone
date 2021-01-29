const express = require('express');

const Model = require('../models/nhentai')['nhentai'];

const router = express.Router();

let getParodies = async (req, res) => {
	let filter = {
		parodies: { $not: { $size: 0 } }
	};

	let page = req.params.page || 1;

	let data = await Model.find(filter).sort({_id: -1}).skip((page - 1) * 20).limit(20),
		count = await Model.find(filter).count();

	res.status(200).render('list', {
		title: `Parodies`,
		listTitle: `Parodies: ${count}`,
		data: data,
		page: Math.ceil(count/20),
		current: page,
		url: `/parodies`
	});
}

router.get('/', getParodies);

router.get('/page/:page', getParodies);

module.exports = router