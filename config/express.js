'use strict';

var app    = require('express')();
var config = require('../config');

if(process.env.NODE_ENV == 'development') {
	app.use(require('morgan')({ format: 'dev' }));
}

app.set('json spaces', 2);

app.use(require('body-parser')({ 'limit': '1000kb' }));
app.use(require('method-override')());

module.exports = app;
