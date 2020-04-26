'use strict';

'use strict';
// Server and Setup
const express = require('express');
const router = express.Router();

// Controller
const Hospital = require('./editDataController');

router.post('/editData', (req, res) => {

	let cookie = req.cookies.sessionId;
	if (!cookie) {
		res.sendStatus(401);
	} else {
		Hospital.editData(cookie, data)
			.then(result => {
				if (result == 401) {
					res.sendStatus(401);
				} else {
					res.send(result);
				}
			})
			.catch(err => {
				console.log(err);
			});
	}
});

module.exports = router;
