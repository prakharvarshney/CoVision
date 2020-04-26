'use strict';
// Server and Setup
const express = require('express');
const router = express.Router();
const path = require('path');

// Controller
const Hospital = require('./controller');

/*
router.get('/dashboard', (req, res) => {
	let cookie = req.cookies.sessionId;

	if (!cookie) {
		res.sendStatus(401);
	} else {
		Hospital.checkAndRender(cookie)
			.then(result => {
				res.sendStatus(200);
			})
			.catch(err => {
				console.log(err);
			});
		}
}); */

router.get('/search', (req, res) => {

	let cookie = req.cookies.sessionId;
	if (!cookie) {
		res.sendStatus(401);
	} else {
		Hospital.getAllHospitalNames(cookie)
			.then(result => {
				if (result == 401) {
					res.sendStatus(401);
				} else {
					res.send(result);
				}
			})
			.catch(err => {
				res.sendStatus(404);
			})
		}
});

router.post('/search/select', (req, res) => {
	let cookie = req.cookies.sessionId;
	let email = req.body.email;
	if (!cookie) {
		res.sendStatus(401);
	} else {
		Hospital.getHospitalFromSearch(cookie, email)
			.then(result => {
				if (result == 401) {
					res.sendStatus(401);
				} else {
					console.log(result);
					res.send(result);
				}
			})
			.catch(err => {
				console.log(err);
			});
	}
});

//Get Hospital Data for search by Hosptial Name
router.post('/dashboard/getHospitalData', async(req, res) => {

	/*
	let hospitalName = req.body.hospitalName;
	let sessionId = req.cookies.sessionId;
	if(!hospitalName)
	{
		res.sendStatus(500)
	}
	const hospitalObj =  await Hospital.getHospitalByName(sessionId, hospitalName)
	res.json(hospitalObj) */

	let session = req.cookies.sessionId;
	Hospital.getHospitalByUser(session)
		.then(result => {
			console.log(result);
			res.json(result);
		})
		.catch(err => {
			res.sendStatus(404);
		});
});

module.exports = router;
