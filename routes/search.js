const express = require('express');

const Model = require('../models/nhentai')['nhentai'];

const router = express.Router();

let search = async (req, res) => {
	let term = req.params.term,
		page =  req.params.page || 1,
		filter = {
			$text: { $search: "\"" + term + "\"" }
		};

	let data = await Model.find(filter).sort({ _id: -1 }).skip((page - 1) * 20).limit(20),
		count = await Model.find(filter).count();

	res.status(200).render('list', {
		title: `'${term}'`,
		listTitle: `${count} results found`,
		data: data,
		page: Math.ceil(count/20),
		current: page,
		url: `/search/${term}`
	});
}

router.get('/:term', search);
router.get('/:term/page/:page', search);

module.exports = router;