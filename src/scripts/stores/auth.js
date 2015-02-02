'use strict';

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

// User needs to be parsed...
var _user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
var _token = localStorage.getItem('token');

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
		case Action.LOGIN_SUCCESS:
			_setUser(action.payload.user);
			_setToken(action.payload.token);
			this.emitChange();
			break;

		case Action.LOAD_USER_SUCCESS:
			_setUser(action.payload);
			this.emitChange();
			break;

		case Action.LOGOUT_SUCCESS:
			_clear();
			this.emitChange();
			break;

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
	return _user;// ? JSON.parse(_user) : null;
}

/**
 *
 */
function getToken() {
	return _token;
}

/**
 *
 */
function _setUser(user) {
	console.log('_setUser', user);
	localStorage.setItem('user', JSON.stringify(_user = user));
}

/**
 *
 */
function _setToken(token) {
	console.log('_setToken', token);
	localStorage.setItem('token', _token = token);
}

/**
 *
 */
function _clear() {
	console.log('clear:', localStorage.removeItem('user'));
	console.log('clear:', localStorage.removeItem('token'));
	_user  = null;
	_token = null;
	// localStorage.removeItem('user');
	// localStorage.removeItem('token');
}
