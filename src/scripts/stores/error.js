'use strict';

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

/**
 * Error descriptions are laid out first by failure type, and then by the error
 * specific status code, if any.
 */
var ErrorDescription = {
	LOGIN_FAILURE: {
		status: {
			400: 'Bad credentials.',
			401: 'Authentication failed. Check your credentials.',
		},
		default: 'Login failed.',
	},
	REGISTER_FAILURE: {
		status: {
			400: 'Bad username or password.',
			409: 'User already exists.',
		},
		default: 'Registration failed.',
	},
	AUTHENTICATION_FAILURE: {
		default: 'Login session expired or invalid.',
	},
}

var _seen   = [ ];
var _unseen = [ ];

var ErrorStoreAPI = {
	getAll:    getAll,
	getSeen:   getSeen,
	getUnseen: getUnseen,
}

/**
 * @module stores/error
 *
 * @description
 * Holds the current Error state of the application. Errors can occur in
 * various parts of the application so it is important to store them in a
 * central location.
 * By default this store listens to all 'FAILURE' events, and since there are
 * quite a lot of them they are not explicitly listed here.
 *
 * @listens event:ERROR_MARK_AS_SEEN
 */
module.exports = createStore(ErrorStoreAPI, function(action) {
	if(action.type === Action.ERROR_MARK_AS_SEEN) {
		_markAsSeen(action.payload);
		return this.emitChange();
	}
	if(action.payload && action.payload.error) {
		var error      = action.payload.error || new Error();
		    error.type = action.type;

		if(ErrorDescription[action.type]) {
			var errorDescription = ErrorDescription[action.type];

			if(error.statusCode) {
				error.description = errorDescription.status[error.statusCode];
			}
			else {
				error.description = errorDescription.default;
			}
		}
		else {
			error.description = action.type;
		}

		_addError(error);
		return this.emitChange();
	}
});

/**
 * Get all the errors currently in the store. This includes both seen and
 * unseen errors for the user.
 *
 * @alias module:stores/error.getAll
 */
function getAll() {
	return _seen.concat(_unseen);
}

/**
 * Get the errors that the user has already seen.
 *
 * @alias module:stores/error.getSeen
 */
function getSeen() {
	return _seen;
}

/**
 * Get the errors the user has not already seen.
 *
 * @alias module:stores/error.getUnseen
 */
function getUnseen() {
	return _unseen;
}

/**
 * Adds the given error to 'unseen', and enhances it with a 'type' property,
 * which will tell us from what type of event the Error originated from.
 */
function _addError(error) {
	return _unseen.push(error);
}

/**
 * Moves the given Error from 'unseen' to 'seen'. Keep in mind that we use
 * referential equality to find the Error.
 */
function _markAsSeen(payload) {
	if(_unseen.indexOf(payload.error) >= 0) {
		_seen.push(_unseen.splice(_unseen.indexOf(payload.error), 1)[0]);
	}
}
