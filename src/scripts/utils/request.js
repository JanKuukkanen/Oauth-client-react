'use strict';

var request = require('request');
var Promise = require('promise');

var config = require('../config');

/**
 *
 */
module.exports = {
	get:  _request.bind(null, request.get),
	put:  _request.bind(null, request.put),
	del:  _request.bind(null, request.del),
	post: _request.bind(null, request.post),
}

/**
 *
 */
function _request(method, opts) {
	return new Promise(function(resolve, reject) {
		var options = {
			withCredentials: false,
			headers: {
				'Accept':        'application/json',
				'Content-Type':  'application/json',
				'Authorization': 'Bearer ' + opts.token + '',
			},
			url:  opts.url,
			body: opts.payload ? JSON.stringify(opts.payload) : null,
		}
		return method(options, function(err, res, body) {
			if(err) {
				return reject(err);
			}
			if(res.statusCode >= 300) {
				var error            = new Error(res.message);
				    error.statusCode = res.statusCode;
				return reject(error);
			}

			var data = { }
			try {
				data = JSON.parse(body);
			}
			finally {}

			return resolve({
				body:    data,
				headers: res.headers,
			});
		});
	});
}
