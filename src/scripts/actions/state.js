'use strict';

var Action     = require('../constants/actions');
var Dispatcher = require('../dispatcher');

/**
 *
 */
module.exports = {
	setting: setting,
}

/**
 *
 */
function setting(key, value) {
	Dispatcher.dispatch({
		payload: {
			key:   key,
			value: value,
		},
		type: Action.CHANGE_SETTING,
	});
}
