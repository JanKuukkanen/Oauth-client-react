'use strict';

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

var _user  = null;//localStorage.getItem('user');
var _token = null;//localStorage.getItem('token');

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
	_user = user;
	// localStorage.setItem('user', JSON.stringify(_user = user));
}

/**
 *
 */
function _setToken(token) {
	_token = token;
	// localStorage.setItem('token', _token = token);
}

/**
 *
 */
function _clear() {
	_user  = null;
	_token = null;
	// localStorage.removeItem('user');
	// localStorage.removeItem('token');
}
