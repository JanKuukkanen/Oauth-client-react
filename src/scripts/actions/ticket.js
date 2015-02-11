'use strict';

var api        = require('../utils/api');
var build      = require('../utils/action-builder');
var Action     = require('../constants/actions');
var Dispatcher = require('../dispatcher');

var AuthStore   = require('../stores/auth');
var TicketStore = require('../stores/ticket');

/**
 * The methods exported by TicketActions
 *
 * TODO Create an 'action-builder.js'.
 */
module.exports = {
	addTicket:    addTicket,
	editTicket:   editTicket,
	loadTickets:  loadTickets,
	removeTicket: removeTicket,
}

/**
 *
 */
function loadTickets(boardID) {
	var opts = {
		id: {
			board: boardID,
		},
		token: AuthStore.getToken(),
	}
	return build(
		Action.LOAD_TICKETS,
		api.getTickets(opts).then(
			function createSuccessPayload(tickets) {
				return {
					boardID: boardID,
					tickets: tickets,
				}
			},
			function createErrorPayload(err) {
				return {
					error: err,
				}
			}
		)
	);
}

/**
 *
 * TODO Make the ID generation into its own utility function.
 */
function addTicket(boardID, dirtyTicket) {
	dirtyTicket.id        = Math.random().toString(36).substr(2, 9);
	dirtyTicket.updatedAt = Date.now();

	Dispatcher.dispatch({
		payload: {
			ticket:  dirtyTicket,
			boardID: boardID,
		},
		type: Action.ADD_TICKET,
	});

	function onSuccess(cleanTicket) {
		Dispatcher.dispatch({
			payload: {
				boardID: boardID,
				dirtyID: dirtyTicket.id,
				cleanID: cleanTicket.id,
			},
			type: Action.ADD_TICKET_SUCCESS,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			payload: {
				error:    err,
				boardID:  boardID,
				ticketID: dirtyTicket.id,
			},
			type: Action.ADD_TICKET_FAILURE,
		});
	}

	var opts = {
		id: {
			board: boardID,
		},
		token:   AuthStore.getToken(),
		payload: dirtyTicket,
	}
	return api.createTicket(opts).then(onSuccess, onError);
}

/**
 *
 */
function editTicket(boardID, ticketID, dirtyTicket) {
	var oldTicket             = TicketStore.getTicket(boardID, ticketID);
	    dirtyTicket.updatedAt = Date.now();

	Dispatcher.dispatch({
		payload: {
			ticket:   dirtyTicket,
			boardID:  boardID,
			ticketID: ticketID,
		},
		type: Action.EDIT_TICKET,
	});

	function onSuccess(cleanTicket) {
		Dispatcher.dispatch({
			payload: {
				ticket:   cleanTicket,
				boardID:  boardID,
				ticketID: ticketID,
			},
			type: Action.EDIT_TICKET_SUCCESS,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			payload: {
				error:    err,
				boardID:  boardID,
				ticket:   oldTicket,
				ticketID: oldTicket.id
			},
			type: Action.EDIT_TICKET_FAILURE,
		});
	}

	var opts = {
		id: {
			board:  boardID,
			ticket: ticketID,
		},
		token:   AuthStore.getToken(),
		payload: dirtyTicket,
	}
	return api.updateTicket(opts).then(onSuccess, onError);
}

/**
 *
 */
function removeTicket(boardID, ticketID) {
	var oldTicket = TicketStore.getTicket(boardID, ticketID);

	Dispatcher.dispatch({
		payload: {
			boardID:  boardID,
			ticketID: ticketID,
		},
		type: Action.REMOVE_TICKET,
	});

	function onSuccess() {
		Dispatcher.dispatch({
			payload: {
				boardID:  boardID,
				ticketID: ticketID,
			},
			type: Action.REMOVE_TICKET_SUCCESS,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			payload: {
				error:   err,
				ticket:  oldTicket,
				boardID: boardID,
			},
			type: Action.REMOVE_TICKET_FAILURE,
		});
	}

	var opts = {
		id: {
			board:  boardID,
			ticket: ticketID,
		},
		token: AuthStore.getToken(),
	}
	return api.deleteTicket(opts).then(onSuccess, onError);
}
