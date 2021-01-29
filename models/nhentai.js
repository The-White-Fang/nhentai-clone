const mongoose = require('mongoose');

const schema = require('../schema/nhentai-schema');

mongoose.connect('mongodb://demon:%40bhishek01@localhost/test?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Connected To Database'))
	.catch((err) => console.log(err.message));

module.exports = {
	nhentai: mongoose.model('hentai', new mongoose.Schema(schema), 'nhentai')
};