const express = require('express');

const Model = require('../models/nhentai')['nhentai'];

const router = express.Router();

let getAll = async (req, res) => {
	let data = await Model.distinct('tags').sort(),
		page = req.params.page || 1;
	// remove null values if any
	data = data.filter(x => x);
	
	let start = (page-1)*100,
		count = data.length;

	res.status(200).render('simple-list', {
		title: `Tags`,
		listTitle: `Tags`,
		data: data.slice(start, start+100),
		page: Math.ceil(count/100),
		current: page,
		url: `/tags/`
	});
}

router.get('/', getAll);
router.get('/page/:page', getAll);

let getTag = async (req, res)=> {
	let tag = req.params.tag,
		page = req.params.page || 1;

	let filter = {
		tags: tag
	};
	
	let data = await Model.find(filter).sort({_id: -1}).skip((page - 1) * 20).limit(20),
		count = await Model.find(filter).count();

	res.status(200).render('list', {
		title: `${tag}`,
		listTitle: `${tag}: ${count}`,
		data: data,
		page: Math.ceil(count/20),
		current: page,
		url: `/tags/${tag}`
	});
}

router.get('/:tag', getTag);

router.get('/:tag/page/:page', getTag);

module.exports = router;