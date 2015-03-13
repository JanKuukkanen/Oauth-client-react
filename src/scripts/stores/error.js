'use strict';

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

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
		_addError(action.payload, action.type);
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
function _addError(payload, type) {
	var error      = payload.error || new Error();
	    error.type = type;
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
