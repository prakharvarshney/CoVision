'use strict';

const mongoose = require('mongoose');
const config = require('../config/api_config');

let db;

if (config.app.type == 'production') {
	db = config.database.hospitals.productionUri;

} else {
	db = config.database.hospitals.devUri;
}
//mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(db, { useCreateIndex: true, useNewUrlParser: true }, (err, database) => {
	if (err) {
		return err;
	} else {
		let Hospitals = database.collection('Hospitals');
	}
});

module.exports = mongoose;