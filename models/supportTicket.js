'use strict';

const mongoose = require('../logic/ticketDb');

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let ticketSchema = Schema({
	created_at: {
		type: Date,
		default: Date.now
	},
	businessEmail: {
		type: String,
		required: true
	},
	businessName: {
		type: String,
		required: true,
		maxLength: 75
	},
	facilityId: {
		type: String,
		required: true
	},
	facilityLicenseNumber: {
		type: String,
		required: true
	},
	businessId: {
		type: String,
		required: true
	},
	issueTitle: {
		type: String,
		required: true
	},
	issueDescription: {
		type: String,
		required: true
	},
	issueClosed: {
		type: Boolean
	}
});

module.exports = ticketSchema;
