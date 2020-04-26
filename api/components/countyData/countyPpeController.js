'use strict';

const mongoose = require('../../../database/hospitals');
const profile = require('../../../models/hospitalProfile');
 // Schema
const Hospital = module.exports = mongoose.model('Hospitals', profile);

 // Session Setup
const sesM = require('../../../database/sessions');
const sessionModel = require('../../../models/hospitalSession');

// Schema
const Session = module.exports = sesM.model('Sessions', sessionModel);

module.exports.getCountyData = async(sessionId, fipsId) => {
	let session = await Session.findOne({ 'sessionId': sessionId });
	if (session == null) {
		return 401;
	} else {
		let hospitals = await Hospital.find({ 'hospitalInfo.fipsId': fipsId }).select('data');
		console.log(hospitals);
	}
}