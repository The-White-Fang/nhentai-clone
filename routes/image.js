const express = require('express');
const request = require('request-promise');

const Model = require('../models/nhentai')['nhentai'];

const router = express.Router();

router.get('/:imgURL', async (req, res) => {
	let imgURL = decodeURIComponent(req.params.imgURL),
		data = await request.get({
			uri: imgURL,
			encoding: null
		});

	res.setHeader('content-type', 'image/jpg');
	res.status(200).send(data);
});

module.exports = router;