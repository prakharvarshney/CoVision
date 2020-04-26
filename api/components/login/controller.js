'use strict';

// Dependency Calls
const config = require('../../../config/api_config');
const bcryptjs = require('bcryptjs');

const mongoose = require('../../../database/hospitals');
const profile = require('../../../models/hospitalProfile');
 // Schema
const Hospital = module.exports = mongoose.model('Hospitals', profile);

 // Session Setup
const sesM = require('../../../database/sessions');
const sessionModel = require('../../../models/hospitalSession');

// Schema
const Session = module.exports = sesM.model('Sessions', sessionModel);


module.exports.login = async(email, password, randomString, projection) => {
	const docs = await Hospital.find({
		'hospitalInfo.email': email,
	}, projection).limit(1).exec();
	
	// Error Handling - Model Return
	if (docs.length === 0) {
		return 401
	}
	let hospital = docs[0];
	
	console.log("Password " + password)
	 const test = await bcryptjs.compare(password, hospital.security.hashed_password);
	 if(test == true)
	 {
		let session = { email: email, sessionId: randomString };
		await Session.deleteMany({"email" : email}) //delete sessions if they already exist
		await Session.create(session, (err, session) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Success!");
				
			}
		})
		 return 200
	 }
	 return 401
}