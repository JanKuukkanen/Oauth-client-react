'use strict';

var Promise = require('promise');

var TicketColor = require('../constants/enums').TicketColor;

/**
 * Mock implementation so API is not needed...
 */
var _mocks = {
	user: {
		name: 'martti@alanen.fi',
		type: 'user',
	},

	board: {
		id:   '123ABC',
		name: 'Mock Board',

		size: {
			width:  10,
			height: 10,
		},

		accessCode: '',
		background: '',
	},

	tickets: [
		{
			id: '123ABC',

			position: {
				x: 100,
				y: 100,
			},

			color:   TicketColor.RED,
			content: 'Mock Ticket #1',

			updatedAt: Date.now(),
		},
		{
			id: '234BCD',

			position: {
				x: 200,
				y: 300,
			},

			color:   TicketColor.RED,
			content: 'Mock Ticket #1',

			updatedAt: Date.now(),
		}
	],
}

var TIMEOUT_MS = 100;

module.exports = {
	login:    login,
	logout:   logout,
	getUser:  getUser,
	getBoard: getBoard,
}

/**
 * The 'opts' object should probably contain the following:
 *   a) The 'token' string.
 *   b) The 'payload' object.
 *   c) The 'identifier' for resources, eg. /boards/identifier...
 * Anything else?
 */

/**
 *
 */
function login(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve({
				user:  _mocks.user,
				token: '1234567ABCDEFG',
			});
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function logout(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve();
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function getUser(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve(_mocks.user);
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function getBoard(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve(_mocks.board);
		}, TIMEOUT_MS);
	});
}


