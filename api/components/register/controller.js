'use strict';

// Dependency Setup

const bcryptjs = require('bcryptjs');
const config = require('../../../config/api_config');

// Database
const mongoose = require('../../../database/hospitals');
const profile = require('../../../models/hospitalProfile');
const Hospital = module.exports = mongoose.model('Hospitals', profile);

async function hash(s) {
  const salt = await bcryptjs.genSalt(10);
  const hashed = await bcryptjs.hash(s, salt);
  return hashed;
}



module.exports.getAllHospitals = async() => {
	let query = Hospital.find({}).select('hospitalInfo.name hospitalInfo.fipsId');
	let doc = await query;
	return doc;
}

module.exports.registerHospital = async(info, bool) => {

	const hashedPassword = await hash(info.password);
	//const verification = await verification(info.userFips, info.originalFips);
	let push = {
		verified: bool,
		'security.hashed_password': hashedPassword,
		'hospitalInfo.email': info.email,
		'hospitalInfo.facilityId': info.facilityId,
		'hospitalInfo.facilityLicenseNumber': info.facilityLicenseNumber,

	}
	Hospital.findOneAndUpdate({ 'hospitalInfo.name': info.name }, {$set: push }, {upsert: false}, (err, hospital) => {
		if (err) {
			console.log(err);
		} else {
			console.log('Success');
		}
	});
	

}