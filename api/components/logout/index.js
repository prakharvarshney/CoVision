'use strict';

const express = require('express');
const router = express.Router();

const Session = require('./controller');
// GET /logout
router.get('/logout', (req, res) => {

	let cookie = req.cookies.sessionId;
	if (!cookie) {
		res.sendStatus(401);
	} else {
		Session.logout(cookie)
			.then(result => {
				if (result == 401) {
					res.sendStatus(401);
				} else {
					res.sendStatus(200);
				}
			})
			.catch(err => {
				console.log(err);
			});
	}
})

module.exports = router;
