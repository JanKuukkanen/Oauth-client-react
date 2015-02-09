'use strict';

var api        = require('../utils/api');
var Action     = require('../constants/actions');
var AuthStore  = require('../stores/auth');
var Dispatcher = require('../dispatcher');

/**
 *
 */
module.exports = {
	login:    login,
	logout:   logout,
	register: register,
	loadUser: loadUser,
}

/**
 *
 */
function login(credentials) {
	Dispatcher.dispatch({
		payload: {
			name: credentials.name,
		},
		type: Action.LOGIN,
	});

	function onSuccess(user) {
		Dispatcher.dispatch({
			type:    Action.LOGIN_SUCCESS,
			payload: user,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			type:    Action.LOGIN_FAILURE,
			payload: err,
		});
	}

	return api.login({ payload: credentials })
		.then(onSuccess, onError);
}

/**
 *
 */
function register(credentials) {
	Dispatcher.dispatch({ type: Action.REGISTER });

	function onSuccess(user) {
		Dispatcher.dispatch({
			type:    Action.REGISTER_SUCCESS,
			payload: user,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			type:    Action.REGISTER_FAILURE,
			payload: err,
		});
	}

	return api.register({ payload: credentials })
		.then(onSuccess, onError);
}

/**
 *
 */
function logout() {
	Dispatcher.dispatch({ type: Action.LOGOUT });

	function onSuccess() {
		Dispatcher.dispatch({
			type: Action.LOGOUT_SUCCESS,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			type:    Action.LOGOUT_FAILURE,
			payload: err,
		});
	}

	return api.logout({ token: AuthStore.getToken() })
		.then(onSuccess, onError);
}

/**
 *
 */
function loadUser() {
	Dispatcher.dispatch({ type: Action.LOAD_USER });

	function onSuccess(user) {
		Dispatcher.dispatch({
			type:    Action.LOAD_USER_SUCCESS,
			payload: user,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			type:    Action.LOAD_USER_FAILURE,
			payload: err,
		});
	}

	return api.getUser({ token: AuthStore.getToken() })
		.then(onSuccess, onError);
}
