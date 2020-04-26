'use strict';

const mongoose = require('../database/hospitals');

let Schema = mongoose.Schema;

let ObjectId = Schema.ObjectId;

let rateSchema = new Schema({
	currentVentilatorsBurnRate: { type: Number },
	averageVentilatorsBurnRate: { type: Number },
	currentSmallGlovesBurnRate: { type: Number },
	averageSmallGlovesBurnRate: { type: Number },
	currentMediumGlovesBurnRate: { type: Number },
	averageMediumGlovesBurnRate: { type: Number },
	currentLargeGlovesBurnRate: { type: Number },
	averageLargeGlovesBurnRate: { type: Number },
	currentExtraLargeGlovesBurnRate: { type: Number },
	averageExtraLargeGlovesBurnRate: { type: Number },
	currentFaceShieldBurnRate: { type: Number },
	averageFaceShieldBurnRate: { type: Number },
	currentSurgicalMasksBurnRate: { type: Number },
	averageSurgicalMasksBurnRate: { type: Number },
	currentSmallGownsBurnRate: { type: Number },
	averageSmallGownsBurnRate: { type: Number },
	currentMediumGownsBurnRate: { type: Number },
	averageMediumGownsBurnRate: { type: Number },
	currentLargeGownsBurnRate: { type: Number },
	averageLargeGownsBurnRate: { type: Number },
	currentExtraLargeGownsBurnRate: { type: Number },
	averageExtraLargeGownsBurnRate: { type: Number },
	current7130RespiratorsBurnRate: { type: Number },
	average7130RespiratorsBurnRate: { type: Number },
	current8210RespiratorsBurnRate: { type: Number },
	average8210RespiratorsBurnRate: { type: Number },
	current1860RespiratorsBurnRate: { type: Number },
	average1860RespiratorsBurnRate: { type: Number },
	burnRateData: [{
		dayNumber: Number, 
		dayDate: {
			type: Date,
			default: Date.now
		},
		ventilators: Number,
		gloves: {
			small: Number,
			medium: Number,
			large: Number,
			extraLarge: Number
		},
		faceShields: Number,
		surgicalMasks: Number,
		gowns: {
			small: Number,
			medium: Number,
			large: Number,
			extraLarge: Number
		},
		respirators: {
			rNorth7130: Number,
			r3M8210: Number,
			r3M1860: Number
		},
	}]
},{ timestamps: true })

let hospitalSchema = Schema({
	created_at: {
		type: Date,
		default: Date.now
	},
	verified: {
		type: Boolean
	},
	hospitalInfo: {
		name: String,
		phone: String,
		email: {
			unique: true,
			index: true,
			type: String,
			validate: {
		      validator: (v) => /^[a-zA-Z0-9\+\.\_\%\-\+]{1,256}\@[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}(\.[a-zA-Z0-9\-]{0,25})+$/gi.test(v),
		      message: '{Value} is not a valid email address!'
	    	}
		},
		facilityId: String,
		facilityLicenseNumber: String,
		hospitalType: String
	},
	security: {
		hashed_password: String,
		temp_hashed_password: String,
		temp_hashed_password_time: Date
	},
	location: {
		address: String,
		city: String,
		state: String,
		county: String,
		zipcode: String,
		geoData: {
			type: { type: String },
			coordinates: []
		},
	},
	data: {
		ventilatorsAvailable: Number,
		ventilatorsInUse: Number,
		gloves: {
			small: Number,
			medium: Number,
			large: Number,
			extraLarge: Number
		},
		faceShields: Number,
		surgicalMasks: Number,
		gowns: {
			small: Number,
			medium: Number,
			large: Number,
			extraLarge: Number
		},
		respirators: {
			n95: Number,
			papr: Number
		},
		coronavirusTests: Number,
		coronavirusPatients: Number,
		coronavirusPUI: Number,
	},
	bedData: {
		totalBedCount: Number,
		totalBedsInUse: Number,
		icuBedCount: Number,
		icuBedsInUse: Number,
		numberLicensedBeds: Number,
		numberStaffedBeds: Number
	},
	staff: {
		totalStaff: Number,
		doctors: {
			onCall: Number,
			onShift: Number,
			total: Number
		},
		nurses: {
			onCall: Number,
			onShift: Number,
			total: Number
		}
	},
	burnRateData: [rateSchema]
}, 
	{	timestamps: true, collection: 'Hospitals'});

module.exports = hospitalSchema;