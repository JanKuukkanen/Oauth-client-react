'use strict';

var Dispatcher = require('../dispatcher');

var SUCCESS_AFFIX = '_SUCCESS';
var FAILURE_AFFIX = '_FAILURE';

/**
 *
 */
module.exports = function actionBuilder(action, payload, promise) {
	if(payload && typeof(payload.then) === 'function') {
		promise = payload;
		payload = { };
	}

	// The initial dispatch is invoked in a timeout, in order to prevent errors
	// with dispatching while the dispatcher is currently dispatching...
	setTimeout(function() {
		Dispatcher.dispatch({
			type:    action,
			payload: payload,
		});
	});

	/**
	 *
	 */
	function onSuccessPayload(successPayload) {
		Dispatcher.dispatch({
			type:    action + SUCCESS_AFFIX,
			payload: successPayload,
		});
	}

	/**
	 *
	 */
	function onErrorPayload(errorPayload) {
		Dispatcher.dispatch({
			type:    action + FAILURE_AFFIX,
			payload: errorPayload,
		});
	}

	return promise.then(onSuccessPayload, onErrorPayload);
}
