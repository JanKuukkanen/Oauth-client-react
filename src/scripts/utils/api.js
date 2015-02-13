'use strict';

var Promise = require('promise');

var TicketColor = require('../constants/enums').TicketColor;

var _mocks = {
	user: {
		id:   '123',
		name: 'martti@alanen.fi',
		type: 'user',
	},
	guest: {
		id:     '444',
		name:   'pertti_pasanen',
		type:   'guest',
		access: '123ABC',
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
			id:   '234ABC',
			name: 'Mock Board #2',

			size: {
				width:  12,
				height: 18,
			},

			accessCode: '',
			background: '',
		},
		{
			id:   '345ABC',
			name: 'Mock Board #3',

			size: {
				width:  8,
				height: 18,
			},

			accessCode: '',
			background: '',
		},

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

			color:   TicketColor.BLUE,
			content: 'Mock Ticket #2',

			updatedAt: Date.now(),
		}
	],
}

var TIMEOUT_MS = (process.env.NODE_ENV === 'test' ? 100 : 0);

module.exports = {
	login:      login,
	logout:     logout,
	register:   register,
	loginGuest: loginGuest,

	getUser: getUser,

	getBoard:  getBoard,
	getBoards: getBoards,

	getTicket:  getTicket,
	getTickets: getTickets,

	createBoard:  createBoard,
	createTicket: createTicket,

	updateBoard:  updateBoard,
	updateTicket: updateTicket,

	deleteBoard:  deleteBoard,
	deleteTicket: deleteTicket,
}

/**
 *
 */
function login(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve({ user: _mocks.user, token: 'IAMAUSER' });
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function logout(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(resolve, TIMEOUT_MS);
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
function loginGuest(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve({ user: _mocks.guest, token: 'IAMAGUEST' });
		});
	}, TIMEOUT_MS);
}

/**
 *
 */
function getUser(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			if(opts.token === 'IAMAGUEST') {
				return resolve(_mocks.guest);
			}
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
function getTicket(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve(_mocks.tickets[0]);
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function getTickets(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve(_mocks.tickets);
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function createBoard(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			opts.payload.id = Math.random().toString(36).substr(2, 9);
			return resolve(opts.payload);
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function createTicket(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			opts.payload.id = Math.random().toString(36).substr(2, 9);
			return resolve(opts.payload);
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function updateBoard(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve(opts.payload);
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function updateTicket(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve(opts.payload);
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function deleteBoard(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve(opts.payload);
		}, TIMEOUT_MS);
	});
}

/**
 *
 */
function deleteTicket(opts) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			return resolve(opts.payload);
		}, TIMEOUT_MS);
	});
}
