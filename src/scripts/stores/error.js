'use strict';

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

/**
 *
 * TODO Immutable?
 */
var _errors = [ ];

/**
 *
 */
var ErrorStoreAPI = {
	all:    all,
	latest: latest,
}

/**
 * ErrorStore implementation.
 */
module.exports = createStore(ErrorStoreAPI, function(action) {
	if(_isFailure(action)) {
		_error(action.payload ? action.payload.error : null, action.type);
		return this.emitChange();
	}
});

/**
 *
 */
function all() {
	return _errors;
}

/**
 *
 */
function latest() {
	return _errors[ _errors.length - 1 ];
}

/**
 *
 */
function _error(err, source) {
	var error           = err || new Error();
	    error.srcAction = source;
	console.error(error);
	return _errors.push(error);
}

/**
 *
 */
function _isFailure(action) {
	return (action.type.indexOf('FAILURE',
		(action.type.length - 'FAILURE'.length)) !== -1);
}
