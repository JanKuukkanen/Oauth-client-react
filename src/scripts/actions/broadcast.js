'use strict';

var Action     = require('../constants/actions');
var Dispatcher = require('../dispatcher');

module.exports = {
	add: add,
	see: see,
}

function add(message) {
	Dispatcher.dispatch({
		payload: { content: message }, type: Action.NEW_BROADCAST,
	});
}

function see(broadcast) {
	Dispatcher.dispatch({
		payload: broadcast, type: Action.MARK_BROADCAST_AS_SEEN,
	});
}
