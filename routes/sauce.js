const express = require('express');

const Model = require('../models/nhentai')['nhentai'];

const router = express.Router();

router.get('/:sauce', async (req, res) => {
	let sauce = parseInt(req.params.sauce);

	let data = await Model.find({ sauce: sauce });

	res.status(200).send(data);
});

module.exports = router;