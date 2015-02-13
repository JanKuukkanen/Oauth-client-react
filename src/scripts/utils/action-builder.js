'use strict';

var Action     = require('../constants/actions');
var Dispatcher = require('../dispatcher');

var SUCCESS_AFFIX = '_SUCCESS';
var FAILURE_AFFIX = '_FAILURE';

/**
 * Used to build 'async' actions with 'success' and 'failure' consequences.
 */
module.exports = function actionBuilder(initialPayload, promise) {
	var actionSuccess = initialPayload.type + SUCCESS_AFFIX;
	var actionFailure = initialPayload.type + FAILURE_AFFIX;

	// The initial dispatch is invoked in a timeout, in order to prevent errors
	// with dispatching while the dispatcher is currently dispatching...
	setTimeout(Dispatcher.dispatch.bind(Dispatcher, initialPayload));

	/**
	 * Dispatch the 'success' event.
	 */
	function onSuccess(payload) {
		Dispatcher.dispatch({
			type:    actionSuccess,
			payload: payload,
		});
	}

	/**
	 * D
	 */
	function onFailure(payload) {
		if(payload.error && payload.error.statusCode === 401) {
			Dispatcher.dispatch({ type: Action.AUTHENTICATION_FAILURE });
		}
		Dispatcher.dispatch({
			type:    actionFailure,
			payload: payload,
		});
	}

	return promise.then(onSuccess, onFailure);
}
