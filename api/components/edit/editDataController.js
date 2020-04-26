'use strict';


// Hospital Setup

const mongooseHospitals = require('../../../database/hospitals');
const profile = require('../../../models/hospitalProfile');
const Hospital = module.exports = mongooseHospitals.model('Hospitals', profile);

// Session Setup

const mongooseSession = require('../../../database/sessions');
const sessionModel = require('../../../models/hospitalSession');
const Session = module.exports = mongooseSession.model('Sessions', sessionModel);


module.exports.editData = async(sessionId, data) => {

	let session = await Session.findOne({ 'sessionId': sessionId });
	if (session == null) {
		return 401;
	} else {

		let email = session.email;
		let data = {
			'data.ventilatorsAvaialable': data.ventilatorsAvaialable,
			'data.ventilatorsInUse': data.ventilatorsInUse,
			'data.gloves.small': data.gloves.small,
			'data.gloves.medium': data.gloves.medium,
			'data.gloves.large': data.gloves.large,
			'data.gloves.extraLarge': data.gloves.extraLarge,
			'data.faceShields': data.gloves.faceShields,
			'data.surgicalMasks': data.gloves.surgicalMasks,
			'data.gowns.small': data.gowns.small,
			'data.gowns.medium': data.gowns.medium,
			'data.gowns.large': data.gowns.large,
			'data.gowns.extraLarge': data.gowns.extraLarge,
			'data.respirators.n95': data.respirators.n95,
			'data.respirators.papr': data.respirators.papr,
			'data.coronavirusTests': data.coronavirusTests,
			'data.coronavirusPatients': data.coronavirusPatients,
			'data.coronavirusPUI': data.coronavirusPUI,
			'bedData.totalBedsInUse': data.totalBedsInUse,
			'bedData.icuBedsInUse': data.icuBedsInUse,
			'staff.totalStaff': data.totalStaff,
			'staff.doctors.onCall': data.doctors.onCall,
			'staff.doctors.onShift': data.doctors.onShift,
			'staff.doctors.total': data.doctors.total,
			'staff.nurses.onCall': data.nurses.onCall,
			'staff.nurses.onShift': data.nurses.onShift,
			'staff.nurses.total': data.nurses.total
		};

		await Hospital.findOneAndUpdate({ 'hospitalInfo.email': email }, { $set: data }, { upsert: false }, (err, hospital) => {
			if (err) {
				return 404;
			} else {
				return 200;
			}
		});

		let hospital = await Hospital.findOne({ 'hospitalInfo.email': email });
		const burnRate = await hospital.burnRate
    const burnData = await burnRate.map(e => e.burnRateData)
					// Small Glove In burn rate
					if(burnData.map(e => e.map(f => f.gloves)).length !== 0) {
						//Glove sizes
							let small = burnData.map(e => e.map(f => f.gloves.small ))
							let medium = burnData.map(e => e.map(f => f.gloves.medium )) 
							let large = burnData.map(e => e.map(f => f.gloves.large ))
							let extraLarge = burnData.map(e => e.map(f => f.gloves.extraLarge ))
							//glove Arr
							gloveArr = [ small, medium, large, extraLarge]
							//sum's gloves arr
							let fsm = []
							// avg'd gloves arr
							let avgGloveRate = []
						for(glove in gloveArr){
							fsm.push(Object.keys(gloveArr[glove]).reduce((sum, key) => sum + parseInt(gloveArr[glove][key]||0),0))
							avgGloveRate.push(parseFloat((fsm[glove]/ (burnData.map(e => e.map(f => f.dayNumber))).length).toFixed(2)))
						}
							data.averageSmallGlovesBurnRate = avgGloveRate[gloveArr.indexOf(small)]
							data.averageMediumGlovesBurnRate = avgGloveRate[gloveArr.indexOf(medium)]
							data.averageLargeGlovesBurnRate = avgGloveRate[gloveArr.indexOf(large)]
							data.averageExtraLargeGlovesBurnRate = avgGloveRate[gloveArr.indexOf(extraLarge)]
						} else {
							data.currentSmallGlovesBurnRate = 0
							data.averageSmallGlovesBurnRate = 0
							data.currentMediumGlovesBurnRate = 0
							data.averageMediumGlovesBurnRate = 0
							data.currentLargeGlovesBurnRate = 0
							data.averageLargeGlovesBurnRate = 0
							data.currentExtraLargeGlovesBurnRate = 0
							data.averageExtraLargeGlovesBurnRate = 0
						}

						//Respirators
						if(burnData.map(e => e.map(f => f.respirators)).length !== 0) {
							//Glove sizes
								let N7130 = burnData.map(e => e.map(f => f.respirators.rNorth7130))
								let r8210 = burnData.map(e => e.map(f => f.respirators.r3M8210)) 
								let r1860 = burnData.map(e => e.map(f => f.respirators.r3M1860))
								//Respirators Arr
								respiratorArr = [N7130, r8210, r1860]
								//sum's Respirators arr
								let fsm = []
								// avg'd Respirators arr
								let avgRespiratorsRate = []
							for( respirator in respiratorArr){
								fsm.push(Object.keys(respiratorArr[respirator]).reduce((sum, key) => sum + parseInt(respiratorArr[respirator][key]||0),0))
								avgRespiratorsRate.push(parseFloat((fsm[respirator]/ (burnData.map(e => e.map(f => f.dayNumber))).length).toFixed(2)))
							}
								data.average7130RespiratorsBurnRate = avgRespiratorsRate[respiratorArr.indexOf(N7130)]
								data.average8210RespiratorsBurnRate = avgRespiratorsRate[respiratorArr.indexOf(r8210)]
								data.average1860RespiratorsBurnRate = avgRespiratorsRate[respiratorArr.indexOf(r1860)]
							} else {
								data.current7130RespiratorsBurnRate = 0
								data.average7130RespiratorsBurnRate = 0
								data.current8210RespiratorsBurnRate = 0
								data.average8210RespiratorsBurnRate = 0
								data.current1860RespiratorsBurnRate = 0
								data.average1860RespiratorsBurnRate = 0
							}

						//Gowns
					if(burnData.map(e => e.map(f => f.gowns)).length !== 0) {
						//Glove sizes
							let small = burnData.map(e => e.map(f => f.gowns.small ))
							let medium = burnData.map(e => e.map(f => f.gowns.medium )) 
							let large = burnData.map(e => e.map(f => f.gowns.large ))
							let extraLarge = burnData.map(e => e.map(f => f.gowns.extraLarge ))
							//gowns Arr
							gownsArr = [ small, medium, large, extraLarge]
							//sum's gowna arr
							let fsm = []
							// avg'd gowns arr
							let avgGownRate = []
						for(gown in gownsArr){
							fsm.push(Object.keys(gownsArr[gown]).reduce((sum, key) => sum + parseInt(gownsArr[gown][key]||0),0))
							avgGownRate.push(parseFloat((fsm[gown]/ (burnData.map(e => e.map(f => f.dayNumber))).length).toFixed(2)))
						}
							data.averageSmallGownsBurnRate = avgGownRate[gownsArr.indexOf(small)]
							data.averageMediumGownsBurnRate = avgGownRate[gownsArr.indexOf(medium)]
							data.averageLargeGownsBurnRate = avgGownRate[gownsArr.indexOf(large)]
							data.averageExtraLargeGownsBurnRate = avgGownRate[gownsArr.indexOf(extraLarge)]
						} else {
							data.currentSmallGownsBurnRate = 0
							data.averageSmallGownsBurnRate = 0
							data.currentMediumGownsBurnRate = 0
							data.averageMediumGownsBurnRate = 0
							data.currentLargeGownsBurnRate = 0
							data.averageLargeGownsBurnRate = 0
							data.currentExtraLargeGownsBurnRate = 0
							data.averageExtraLargeGownsBurnRate = 0
						}

						//Face Shield/Surgical Mask/Ventilators
						if(burnData.map(e => e.map(f => f.respirators)).length !== 0) {
							//Ventilators Avg Burn Rate
							let ventilators = burnData.map(e => e.map(f => f.ventilators))
							let ventilatorsSum = Object.keys(ventilators).reduce((sum, key) => sum + parseInt(ventilators[key]||0),0)
							let avgVentilators = parseFloat((ventilatorsSum / (burnData.map(e => e.map(f => f.dayNumber))).length).toFixed(2))
							data.averageVentilatorsBurnRate = avgVentilators
							//Face Shields Avg Burn Rate
							let faceShields = burnData.map(e => e.map(f => f.faceShields))
							let faceShieldSum = Object.keys(faceShields).reduce((sum, key) => sum + parseInt(faceShields[key]||0),0)
							let avgFaceShields = parseFloat((faceShieldSum / (burnData.map(e => e.map(f => f.dayNumber))).length).toFixed(2))
							data.averageFaceShieldBurnRate = avgFaceShields
							//SurgicalMasks Avg Burn Rate
							let surgicalMasks = burnData.map(e => e.map(f => f.surgicalMasks))
							let surgicalMasksSum = Object.keys(surgicalMasks).reduce((sum, key) => sum + parseInt(surgicalMasks[key]||0),0)
							let avgSurgicalMasks = parseFloat((surgicalMasksSum / (burnData.map(e => e.map(f => f.dayNumber))).length).toFixed(2))
							data.averageSurgicalMasksBurnRate = avgSurgicalMasks
						} else {
							data.averageFaceShieldBurnRate = 0
							data.currentFaceShieldBurnRate = 0
							data.averageVentilatorsBurnRate = 0
							data.currentVentilatorsBurnRate = 0
							data.averageSurgicalMasksBurnRate = 0
							data.currentSurgicalMasksBurnRate= 0
						}
						
					//Set currentBurnRate
				if(burnRate.length > 0 ){
						data.current7130RespiratorsBurnRate = burnRate[burnRate.length-1].average7130RespiratorsBurnRate
						req.body.current8210RespiratorsBurnRate = burnRate[burnRate.length-1].average8210RespiratorsBurnRate
						req.body.current1860RespiratorsBurnRate = burnRate[burnRate.length-1].average1860RespiratorsBurnRate
						// req.body.currentFaceShieldBurnRate = burnRate[burnRate.length-1].averageFaceShieldBurnRate
						// req.body.currentVentilatorsBurnRate = burnRate[burnRate.length-1].averageVentilatorsBurnRate
						req.body.currentSmallGlovesBurnRate = burnRate[burnRate.length-1].averageSmallGlovesBurnRate
						req.body.currentMediumGlovesBurnRate = burnRate[burnRate.length-1].averageMediumGlovesBurnRate
						req.body.currentLargeGlovesBurnRate = burnRate[burnRate.length-1].averageLargeGlovesBurnRate
						req.body.currentExtraLargeGlovesBurnRate = burnRate[burnRate.length-1].averageExtraLargeGlovesBurnRate
						// console.log(req.body.currentGlovesBurnRate, req.body.currentVentilatorsBurnRate, req.body.currentFaceShieldBurnRate)
					} else {
						data.current7130RespiratorsBurnRate = 0
						data.average7130RespiratorsBurnRate = 0
						data.current8210RespiratorsBurnRate = 0
						data.average8210RespiratorsBurnRate = 0
						data.current1860RespiratorsBurnRate = 0
						data.average1860RespiratorsBurnRate = 0
						data.averageFaceShieldBurnRate = 0
						data.currentFaceShieldBurnRate = 0
						data.averageVentilatorsBurnRate = 0
						data.currentVentilatorsBurnRate = 0
						data.averageSurgicalMasksBurnRate = 0
						data.currentSurgicalMasksBurnRate= 0
						data.currentSmallGownsBurnRate = 0
						data.averageSmallGownsBurnRate = 0
						data.currentMediumGownsBurnRate = 0
						data.averageMediumGownsBurnRate = 0
						data.currentLargeGownsBurnRate = 0
						data.averageLargeGownsBurnRate = 0
						data.currentExtraLargeGownsBurnRate = 0
						data.averageExtraLargeGownsBurnRate = 0
					}
		burnRate = {
			'burnRateData.gloves.small': data.gloves.small,
			'burnRateData.gloves.medium': data.gloves.medium,
			'burnRateData.gloves.large': data.gloves.large,
			'burnRateData.gloves.extraLarge': data.gloves.extraLarge,
			'burnRateData.faceShields': data.gloves.faceShields,
			'burnRateData.surgicalMasks': data.gloves.surgicalMasks,
			'burnRateData.gowns.small': data.gowns.small,
			'burnRateData.gowns.medium': data.gowns.medium,
			'burnRateData.gowns.large': data.gowns.large,
			'burnRateData.gowns.extraLarge': data.gowns.extraLarge,
			'burnRateData.respirators.rNorth7130': data.respirators.rNorth7130,
			'burnRateData.respirators.r3M8210': data.respirators.r3M8210,
			'burnRateData.respirators.r3M1860': data.respirators.r3M1860,
		}
		await Hospital.findOneAndUpdate({ 'hospitalInfo.emil': email }, { $set: burnRate }, {upsert: false}, (err, hospital) => {
			if(err) {
				return 404;
			} else {
				return 200
			}
		})

	}
}






