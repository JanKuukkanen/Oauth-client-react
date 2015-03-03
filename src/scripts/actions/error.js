'use strict';

var Action     = require('../constants/actions');
var Dispatcher = require('../dispatcher');

/**
 * @module actions/error
 *
 * @description
 * Provides methods for modifying the state of ErrorStore.
 */
module.exports = {
	markAsSeen: markAsSeen,
}

/**
 * Mark the error as seen.
 * @alias module:actions/error.markAsSeen
 *
 * @fires event:ERROR_MARK_AS_SEEN
 */
function markAsSeen(err) {
	Dispatcher.dispatch({
		payload: {
			error: err,
		},
		type: Action.ERROR_MARK_AS_SEEN,
	});
}
