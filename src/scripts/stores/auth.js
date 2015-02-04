'use strict';

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

/**
 *
 */
var authStoreAPI = {
	getUser:  getUser,
	getToken: getToken,
}

/**
 *
 */
module.exports = createStore(authStoreAPI, function(action) {
	switch(action.type) {
		/**
		 *
		 */
		case Action.LOGIN_SUCCESS:
			_setUser(action.payload.user);
			_setToken(action.payload.token);
			this.emitChange();
			break;

		/**
		 *
		 */
		case Action.LOAD_USER_SUCCESS:
			_setUser(action.payload);
			this.emitChange();
			break;

		/**
		 *
		 */
		case Action.LOGOUT_SUCCESS:
			_clear();
			this.emitChange();
			break;

		/**
		 *
		 */
		case Action.AUTH_FAILURE:
			_clear();
			this.emitChange();
			break;
	}
});

/**
 *
 */
function getUser() {
	if(localStorage.getItem('user')) {
		return JSON.parse(localStorage.getItem('user'));
	}
	return null;
}

/**
 *
 */
function getToken() {
	return localStorage.getItem('token');
}

/**
 *
 */
function _setUser(user) {
	localStorage.setItem('user', JSON.stringify(user));
}

/**
 *
 */
function _setToken(token) {
	localStorage.setItem('token', token);
}

/**
 *
 */
function _clear() {
	localStorage.removeItem('user');
	localStorage.removeItem('token');
}
