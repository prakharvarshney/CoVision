'use strict';

// Server Setup & Config
const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../../../config/api_config');
const Hospital = require('./controller');

// Get Register Page
// Add API Call to Get all Hosptial Names and Send to Array
router.get('/register', (req, res) => {
	Hospital.getAllHospitals()
		.then(result => {
			res.send(result);
		})
		.catch(err => {
			if (err.status) {
				res.status(err.status).json({
					message: err.message
				});
			} else {
				res.sendStatus(500);				}
		});
});

// Register Form Submission - POST
router.post('/register/hospital', (req, res) => {
	console.log("Egg")
	const email = req.body.email;
	const password = req.body.password;
	const facilityId = req.body.facilityId;
	const facilityLicenseNumber = req.body.facilityLicenseNumber;
	const originalFips = req.body.originalFips;
	const userFips = req.body.userFips;
	const hospitalName = req.body.name;
	
	let formCheck = req.body.check;
	let upperFormCheck = formCheck.toString().toUpperCase();

	let info = {
		name: hospitalName,
		email: email,
		password: password,
		facilityId: facilityId,
		originalFips: originalFips,
		userFips: userFips,
		facilityLicenseNumber: facilityLicenseNumber
	};

	console.log(info);
	
	if (!upperFormCheck || upperFormCheck !== 'WHITE') {
		res.redirect('/api/register');
	} else if (userFips == originalFips) {
		Hospital.registerHospital(info, true)
			.then(result => {
				res.sendStatus(200);
			})
			.catch(err => {
				if (err.status) {
					res.status(err.status).json({
						message: err.message
					});
				} else {
					res.sendStatus(500);				}
			});
	} else {
		Hospital.registerHospital(info, false)
			.then(result => {
				res.redirect('/api/login');
			})
			.catch(err => {
				if (err.status) {
					res.status(err.status).json({
						message: err.message
					});
				} else {
					res.sendStatus(500);				}
			});
	}
});

module.exports = router;
