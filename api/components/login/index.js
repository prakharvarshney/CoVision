'use strict';
// Server and Setup
const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../../../config/api_config');
const cryptoRandomString = require('crypto-random-string');
// Login & Security
const Hospital = require('./controller');
const Session = require('../session/controller');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
router.use(require('cookie-parser')());




// Login Form Submission
router.post('/login/authenticate', (req, res) => {

	let randomString = cryptoRandomString({ length: 16, type: 'url-safe'});
	

	// Set Form Body Fields
	let email = req.body.email;
	let password = req.body.password;

	// Login Controller
	Hospital.login(email, password, randomString)
		.then(result => {
			if(result == 200)
			{
				res.cookie('sessionId', randomString, {
					maxAge: 900000,
					httpOnly: true
				});
				res.sendStatus(200)
			}
			else {
				res.sendStatus(401);
			}
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

module.exports = router;
