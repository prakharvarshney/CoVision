'use strict';

const express = require('express');
const compression = require('compression');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
 
// Sessions
const session = require('express-session');
const redis = require('redis');

let RedisStore = require('connect-redis')(session)
let redisClient = require('redis').createClient(process.env.REDIS_URL);

// Config
const config = require('./config/api_config');

// Init App
const app = module.exports = express();

redisClient.on('error', (err) => {
	console.log(`Redis Err: ${err}`);
});

//For parsing Cookie header and populating req.cookies
app.use(cookieParser());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: config.app.secret,
    resave: false,
    saveUninitialized: true
  })
)

// App Setup
app.use(logger('dev'));

// Format Data as JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Static Files
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'Client/build')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/Client/build', 'index.html'));
})

// Initialize Routing
require('./api/index')(app);
//require('./admin/index')(app);

// Compression
app.use(compression());

// Server 500 Handler
app.use((err, req, res, next) => {
	res.status(500).send('Server Error (500): ' + err);
});

module.exports = app;