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

	boards: [
		{
			id:   '123ABC',
			name: 'Mock Board #1',

			size: {
				width:  10,
				height: 10,
			},

			accessCode: '',
			background: '',
		},
		{
			id:   '234BCD',
			name: 'Mock Board #2',

			size: {
				width:  12,
				height: 18,
			},

			accessCode: '',
			background: '',
		}
	],

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
	register: register,

	getUser: getUser,

	getBoard:  getBoard,
	getBoards: getBoards,
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
function register(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve(_mocks.user);
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
			return resolve(_mocks.boards[0]);
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function getBoards(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve(_mocks.boards);
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function getTickets(opts) {
	// http.get /boards/ opts.id.board /tickets
	//
}


