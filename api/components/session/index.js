'use strict';

const express = require('express');
const router = express.Router();
const Session = require('./controller');

router.use(require('cookie-parser')());

router.post('/verifySession', (req, res) => {
	let cookie = req.cookies.sessionId;
	
	console.log(cookie);
	if (!cookie) {
		res.json({status : "No Session"});
	} else {
		Session.verifySession(cookie)
			.then(result => {
				if (result.status == "No Session") {
					res.json({status : "No Session"});
				} else {
					res.json({status : "Valid Session"})
				}
			})
			.catch(err => {
				console.log(err);
			});
	}
});

module.exports = router;
