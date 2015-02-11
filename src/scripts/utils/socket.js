'use strict';

var io      = require('socket.io-client');
var Promise = require('promise');

var DataActions = require('../actions/data');

/**
 *
 */
module.exports = {
	connect:    connect,
	disconnect: disconnect,
}

/**
 *
 */
var _socket = null;

/**
 *
 */
function connect(opts) {
	return new Promise(function(resolve, reject) {
		if(_socket && _socket.connected) {
			return resolve(_socket);
		}
		return io(config.io.url, opts)
			.on('connect', function() {
				// We might need to attach the event handlers here... and maybe
				// it's ok!
				//
				// this.on('ticket:edit', _onTicketEdit);
				// ...

				return resolve();
			})
			.on('error', function(err) {
				return reject(err);
			});
	});
}

/**
 *
 */
function disconnect() {
	_socket.disconnect();
}

/*
	... in 'app.js'

	route '/workspace'
		-> socket.connect()
	route '/board'
		-> socket.connect()

	on-logout -> socket.disconnect()
 */
