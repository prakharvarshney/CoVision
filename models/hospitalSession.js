'use strict';

const mongoose = require('../database/sessions');

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let sessionSchema = Schema({
	sessionId: {
		type: String,
		required: true
	},
	email: {
		type: String
	}
}, {collection: 'Sessions'});

module.exports = sessionSchema;