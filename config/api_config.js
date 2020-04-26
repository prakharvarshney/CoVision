'use strict';

require('dotenv').config();

const config = {
	app: {
		type: process.env.NODE_ENV,
		secret: 'LiliusMedPlatform',
		port: parseInt(process.env.PORT)
	},
	database: {
		tickets: {
			productionUri: process.env.MONGO_TICKET_URI_PRODUCTION,
			devUri: process.env.MONGO_TICKET_URI_DEV
		},
		hospitals: {
			productionUri: process.env.MONGO_HOSPITALS_URI_PRODUCTION,
			devUri: process.env.MONGO_HOSPITALS_URI_DEV
		},
		sessions: {
			productionUri: process.env.MONGO_SESSIONS_URI_PRODUCTION,
			devUri: process.env.MONGO_SESSIONS_URI_DEV
		}
	}
};

module.exports = config;