'use strict';

var Action     = require('../constants/actions');
var Dispatcher = require('../dispatcher');

/**
 *
 */
module.exports = {
	setSetting:      setSetting,
	setActiveTicket: setActiveTicket,
}

/**
 *
 */
function setSetting(key, value) {
	return Dispatcher.dispatch({
		payload: {
			key:   key,
			value: value,
		},
		type: Action.CHANGE_SETTING,
	});
}

/**
 *
 */
function setActiveTicket(ticketID) {
	return Dispatcher.dispatch({
		payload: {
			id: ticketID,
		},
		type: Action.SET_ACTIVE_TICKET,
	});
}
