'use strict';

const app = require('./app');
const path = require('path');
const portConfig = require('./config/api_config');

const PORT = portConfig.app.port;

let ENV;

if (app.get('env') === 'development') {
	ENV = 0;
	console.log(__dirname);
} else {
	ENV = 1;
}
app.listen(PORT, (err) => {
	if (err) {
		if (ENV == 0) {
			console.log('CoVision Error: ' + err);
		}
		return server.status(0);
	} else {
		console.log('CoVision listening on PORT: ' + PORT);
	}
});