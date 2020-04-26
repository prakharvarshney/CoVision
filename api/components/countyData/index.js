'use strict';
// Server and Setup
const express = require('express');
const router = express.Router();

const CountyPpe = require('./countyPpeController');

router.post('/county/data/ppeNumbers', (req, res) => {
	let cookie = req.cookies.sessionId;
	let fipsId = req.body.fipsId;
	console.log('1');
	if (!cookie) {
		console.log('2');
		res.json({status : "No Session"});
	} else {
		console.log('3');
		CountyPpe.getCountyData(cookie, fipsId)
			.then(result => {
				console.log('4');
				if (result.status == "No Session") {
					console.log('5');
					res.json({status : "No Session"});
				} else {
					console.log('6');
					res.json({status : "Valid Session"})
				}
			})
			.catch(err => {
				console.log('7');
				console.log(err);
			});
	}
});

module.exports = router;
