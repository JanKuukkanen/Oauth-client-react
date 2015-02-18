'use strict';

var api   = require('../utils/api');
var build = require('../utils/action-builder');

var Action    = require('../constants/actions');
var AuthStore = require('../stores/auth');

/**
 * @module actions/auth
 *
 * @description
 * Since the methods defined here are mostly async, they tend to return a
 * Promise, which will indicate when the action is done. This promise can then
 * be used to trigger something like a redirect to another page of the app.
 */
module.exports = {
	login:       login,
	loginGuest:  loginGuest,
	logout:      logout,
	register:    register,
	loadUser:    loadUser,
}

/**
 * Login as a user with the given credentials.
 *
 * @alias module:actions/auth.login
 *
 * @param {object} credentials
 * @param {string} credentials.email     Email of the user.
 * @param {string} credentials.password  Password of the user.
 */
function login(credentials) {
	var opts = {
		payload: credentials,
	}
	var initial = {
		type: Action.LOGIN,
	}

	function _onSuccess(res) {
		return {
			user:  res.user,
			token: res.token,
		}
	}

	function _onFailure(err) {
		return { error: err }
	}

	return build(initial, api.login(opts).then(_onSuccess, _onFailure));
}

/**
 * Login as a guest with the given credentials.
 *
 * @alias module:actions/auth.loginGuest
 *
 * @param {object} credentials
 * @param {string} credentials.boardID     The board we are trying to access.
 * @param {string} credentials.username    Username for the guest session.
 * @param {string} credentials.accessCode  The access code for the board we are
 *                                         trying to access.
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

	function _onSuccess(res) {
		return {
			user:  res.user,
			token: res.token,
		}
	}

	function _onFailure(err) {
		return { error: err }
	}

	return build(initial, api.loginGuest(opts).then(_onSuccess, _onFailure));
}

/**
 * Terminate the current login session.
 *
 * @alias module:actions/auth.logout
 */
function logout() {
	var opts = {
		token: AuthStore.getToken(),
	}
	var initial = {
		type: Action.LOGOUT,
	}

	function _onSuccess() {
		return { }
	}

	function _onFailure(err) {
		return { error: err }
	}

	return build(initial, api.logout(opts).then(_onSuccess, _onFailure));
}

/**
 * Register a new user account.
 *
 * @alias module:actions/auth.register
 *
 * @param {object} credentials
 * @param {string} credentials.email     Email of the user.
 * @param {string} credentials.password  Password of the user.
 */
function register(credentials) {
	var opts = {
		payload: credentials,
	}
	var initial = {
		type: Action.REGISTER,
	}

	function _onSuccess(user) {
		return { user: user }
	}

	function _onFailure(err) {
		return { error: err }
	}

	return build(initial, api.register(opts).then(_onSuccess, _onFailure));
}

/**
 * Loads the user's information based on the currently active access token.
 *
 * @alias module:actions/auth.loadUser
 */
function loadUser() {
	var opts = {
		token: AuthStore.getToken(),
	}
	var initial = {
		type: Action.LOAD_USER,
	}

	function _onSuccess(user) {
		return { user: user }
	}

	function _onFailure(err) {
		return { error: err }
	}

	return build(initial, api.getUser(opts).then(_onSuccess, _onFailure));
}
