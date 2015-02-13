'use strict';

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

/**
 * Public API of the AuthStore.
 */
var AuthStoreAPI = {
	getUser:  getUser,
	getToken: getToken,
}

module.exports = createStore(AuthStoreAPI, function(action) {
	switch(action.type) {

		case Action.LOGIN_SUCCESS:
		case Action.LOGIN_GUEST_SUCCESS:
			_setUser(action.payload.user);
			_setToken(action.payload.token);
			this.emitChange();
			break;

		case Action.LOAD_USER_SUCCESS:
			_setUser(action.payload.user);
			this.emitChange();
			break;

		case Action.LOGOUT_GUEST:
		case Action.LOGOUT_SUCCESS:
			_clear();
			this.emitChange();
			break;

		case Action.AUTHENTICATION_FAILURE:
			_clear();
			this.emitChange();
			break;
	}
});

/**
 * Returns the currently logged in user.
 */
function getUser() {
	if(localStorage.getItem('user')) {
		return JSON.parse(localStorage.getItem('user'));
	}
	return null;
}

/**
 * Returns the token of the currently logged in user.
 */
function getToken() {
	return localStorage.getItem('token');
}

/**
 * Set the user.
 */
function _setUser(user) {
	localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Set the token.
 */
function _setToken(token) {
	localStorage.setItem('token', token);
}

/**
 * Clears the current credentials, effectively logging out the user.
 */
function _clear() {
	localStorage.removeItem('user');
	localStorage.removeItem('token');
}
