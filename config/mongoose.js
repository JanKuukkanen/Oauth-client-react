'use strict';

var mongoose = require('mongoose');

mongoose.model('image',  require('./schemas/user'));

module.exports = mongoose;
