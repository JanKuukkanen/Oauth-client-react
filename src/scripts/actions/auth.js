'use strict';

var api        = require('../utils/api');
var build      = require('../utils/action-builder');
var Action     = require('../constants/actions');
var AuthStore  = require('../stores/auth');
var Dispatcher = require('../dispatcher');

/**
 *
 */
module.exports = {
	login:      login,
	loginGuest: loginGuest,

	logout:      logout,
	logoutGuest: logoutGuest,

	register: register,
	loadUser: loadUser,
}

/**
 *
 */
function login(credentials) {
	var opts = {
		payload: credentials,
	}
	var initial = {
		type: Action.LOGIN,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess(res) {
		return {
			user:  res.user,
			token: res.token,
		}
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return { error: err }
	}

	return build(initial, api.login(opts).then(onSuccess, onFailure));
}

/**
 *
 */
function loginGuest(credentials) {
	var opts = {
		id: {
			code:  credentials.accessCode,
			board: credentials.boardID,
		},
		payload: {
			username: credentials.username,
		}
	}
	var initial = {
		type: Action.LOGIN_GUEST,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess(res) {
		return {
			user:  res.user,
			token: res.token,
		}
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return { error: err }
	}

	return build(initial, api.loginGuest(opts).then(onSuccess, onFailure));
}

/**
 *
 */
function logoutGuest() {
	return Dispatcher.dispatch({ type: Action.LOGOUT_GUEST });
}

/**
 *
 */
function register(credentials) {
	var opts = {
		payload: credentials,
	}
	var initial = {
		type: Action.REGISTER,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess(user) {
		return { user: user }
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return { error: err }
	}

	return build(initial, api.register(opts).then(onSuccess, onFailure));
}

/**
 *
 */
function logout() {
	var opts = {
		token: AuthStore.getToken(),
	}
	var initial = {
		type: Action.LOGOUT,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess() {
		return {}
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return { error: err }
	}

	return build(initial, api.logout(opts).then(onSuccess, onFailure));
}

/**
 *
 */
function loadUser() {
	var opts = {
		token: AuthStore.getToken(),
	}
	var initial = {
		type: Action.LOAD_USER,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess(user) {
		return { user: user }
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return { error: err }
	}

	return build(initial, api.getUser(opts).then(onSuccess, onFailure));
}
