const express = require('express');

const Model = require('../models/nhentai')['nhentai'];

const router = express.Router();

let getNew = async (req, res) => {
	let page = req.params.page || 1;

	let data = await Model.find().sort({_id: -1}).skip((page - 1) * 20).limit(20),
		count = await Model.find().count();

	res.status(200).render('list', {
		title: `new`,
		listTitle: `Most Recent Uploads`,
		data: data,
		page: Math.ceil(count/20),
		current: page,
		url: `/new`
	});
}

router.get('/', getNew);

router.get('/page/:page', getNew);

module.exports = router;