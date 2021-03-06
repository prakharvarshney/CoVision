'use strict';

const jwt = require('jsonwebtoken');
const config = require('./api_config');

module.exports = {
  validateToken: (req, res, next) => {
    const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
      const options = {
        expiresIn: '1d',
        issuer: 'covisionapp'
      };
      try {
        
        result = jwt.verify(token, config.app.secret, options);

        req.decoded = result;
        
        next();
      } catch (err) {
        
        throw new Error(err);
      }
    } else {
      result = { 
        error: `Authentication error. Token required.`,
        status: 401
      };
      res.status(401).send(result);
    }
  }
};