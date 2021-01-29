const express = require('express');

const router = express.Router();

router.get('*', (req, res) => {
	res.status(404).render('error', {
		title: '404 Not Found',
		errorCode: 404,
		error: 'Not Found',
		message: 'The requested resource does not exist on this server'
	});
})

module.exports = router;