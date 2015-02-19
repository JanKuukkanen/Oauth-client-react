'use strict';

var Promise = require('promise');

var config  = require('../config');
var request = require('../utils/request');

/**
 *
 */
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

	revokeAccessCode:   revokeAccessCode,
	generateAccessCode: generateAccessCode,
}

/**
 *
 */
function login(opts) {
	var options = {
		url:     config.api + '/auth/login',
		payload: opts.payload,
	}
	return request.post(options).then(function(res) {
		return {
			user:  res.body,
			token: res.headers['x-access-token'],
		}
	});
}

/**
 *
 */
function logout(opts) {
	var options = {
		url:   config.api + '/auth/logout',
		token: opts.token,
	}
	return request.post(options);
}

/**
 *
 */
function register(opts) {
	var options = {
		url:     config.api + '/auth/register',
		payload: opts.payload,
	}
	return request.post(options).then(function(res) {
		return { user: res.body }
	});
}

/**
 *
 */
function loginGuest(opts) {
	var options = {
		url:     config.api + '/boards/' +
		         opts.id.board + '/access/' + opts.id.code + '',
		payload: opts.payload,
	}
	return request.post(options).then(function(res) {
		return {
			user: {
				id:     res.body.id,
				type:   res.body.type,
				name:   res.body.username,
				access: res.body.access,
			},
			token: res.headers['x-access-token'],
		}
	});
}

/**
 *
 */
function getUser(opts) {
	var options = {
		url:   config.api + '/auth',
		token: opts.token,
	}
	return request.get(options).then(function(res) {
		var user = {
			id:   res.body.id,
			type: res.body.type,
			name: res.body.username,
		}
		if(user.type === 'guest') {
			user.access = res.body.access;
		}
		return user;
	});
}

/**
 *
 */
function getBoard(opts) {
	var options = {
		url:   config.api + '/boards/' + opts.id.board + '',
		token: opts.token,
	}
	return request.get(options).then(function(res) {
		return res.body;
	});
}

/**
 *
 */
function getBoards(opts) {
	var options = {
		url:   config.api + '/boards',
		token: opts.token,
	}
	return request.get(options).then(function(res) {
		return res.body;
	});
}

/**
 *
 */
function getTicket(opts) {
	var options = {
		url:   config.api + '/boards/' +
		       opts.id.board + '/tickets/' + opts.id.ticket + '',
		token: opts.token,
	}
	return request.get(options).then(function(res) {
		return res.body;
	});
}

/**
 *
 */
function getTickets(opts) {
	var options = {
		url:   config.api + '/boards/' + opts.id.board + '/tickets',
		token: opts.token,
	}
	return request.get(options).then(function(res) {
		return res.body;
	});
}

/**
 *
 */
function createBoard(opts) {
	var options = {
		url:     config.api + '/boards',
		token:   opts.token,
		payload: opts.payload,
	}
	return request.post(options).then(function(res) {
		return res.body;
	});
}

/**
 *
 */
function createTicket(opts) {
	var options = {
		url:     config.api + '/boards/' + opts.id.board + '/tickets',
		token:   opts.token,
		payload: opts.payload,
	}
	return request.post(options).then(function(res) {
		return res.body;
	});
}

/**
 *
 */
function updateBoard(opts) {
	var options = {
		url:     config.api + '/boards/' + opts.id.board + '',
		token:   opts.token,
		payload: opts.payload,
	}
	return request.put(options).then(function(res) {
		return res.body;
	});
}

/**
 *
 */
function updateTicket(opts) {
	var options = {
		url:     config.api + '/boards/' +
		         opts.id.board + '/tickets/' + opts.id.ticket + '',
		token:   opts.token,
		payload: opts.payload,
	}
	return request.put(options).then(function(res) {
		return res.body;
	});
}

/**
 *
 */
function deleteBoard(opts) {
	var options = {
		url:   config.api + '/boards/' + opts.id.board + '',
		token: opts.token,
	}
	return request.del(options).then(function(res) {
		return res.body;
	});
}

/**
 *
 */
function deleteTicket(opts) {
	var options = {
		url:   config.api + '/boards/' +
		       opts.id.board + '/tickets/' + opts.id.ticket + '',
		token: opts.token,
	}
	return request.del(options).then(function(res) {
		return res.body;
	});
}

/**
 *
 */
function generateAccessCode(opts) {
	var options = {
		url:   config.api + '/boards/' + opts.id.board + '/access',
		token: opts.token,
	}
	return request.post(options).then(function(res) {
		return res.body;
	});
}

/**
 *
 */
function revokeAccessCode(opts) {
	var options = {
		url:   config.api + '/boards/' + opts.id.board + '/access',
		token: opts.token,
	}
	return request.del(options).then(function(res) {
		return res.body;
	});
}
