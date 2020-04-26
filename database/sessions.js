'use strict';

const mongoose = require('mongoose');
const config = require('../config/api_config');

let db;

if (config.app.type == 'production') {
	db = config.database.sessions.productionUri;

} else {
	db = config.database.sessions.devUri;
}
//mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(db, { useCreateIndex: true, useNewUrlParser: true }, (err, database) => {
	if (err) {
		return err;
	} else {
		let Hospitals = database.collection('Sessions');
	}
});

module.exports = mongoose;