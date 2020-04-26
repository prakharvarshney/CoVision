'use strict';

// Dependency Calls

const config = require('../../../config/api_config');

// Hospital Setup

const mongooseHospitals = require('../../../database/hospitals');
const profile = require('../../../models/hospitalProfile');
const Hospital = module.exports = mongooseHospitals.model('Hospitals', profile);

// Session Setup

const mongooseSession = require('../../../database/sessions');
const sessionModel = require('../../../models/hospitalSession');
const Session = module.exports = mongooseSession.model('Sessions', sessionModel);


module.exports.checkAndRender = async(sessionId) => {

	let session = await Session.findOne({ 'sessionId': sessionId });
	if (session == null) {
		return 401;
	} else {
		let email = session.email;
		let hospital = await Hospital.findOne({ 'hospitalInfo.email': email }).select('-security');
		return hospital;
	}
}

module.exports.getAllHospitalNames = async(sessionId) => {
	let session = await Session.findOne({ 'sessionId': sessionId });
	if (session == null) {
		return 401;
	} else {
		let names = await Hospital.find({}).select('hospitalInfo.name');
		return names;
	}
}

module.exports.getHospitalFromSearch = async(sessionId, email) => {
	let session = await Session.findOne({ 'sessionId': sessionId });
	if (session == null) {
		return 401;
	} else {
		let hospital = await Hospital.findOne({'hospitalInfo.email': email }).select('-security');
		return hospital;
	}
}

module.exports.getHospitalByUser = async(sessionId) => {
	let session = await Session.findOne({ 'sessionId': sessionId });
	if (session == null) {
		return 401;
	} else {
		let hospital = await Hospital.findOne({ 'hospitalInfo.email': session.email }).select('-burnRateData').select('-created_at');
		return hospital;
	}
	/*if (session == null) {
		return 401;
	} else {
		let hospital = await Hospital.findOne({'hospitalInfo.name': name }).select('-security').select('-_id').select('-verified')
		.select('-burnRateData').select('-created_at');
		return hospital;
	}
	*/
}