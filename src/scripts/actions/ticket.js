'use strict';

var _ = require('lodash');

var uid    = require('../utils/uid');
var api    = require('../utils/api');
var build  = require('../utils/action-builder');
var Action = require('../constants/actions');

var AuthStore   = require('../stores/auth');
var TicketStore = require('../stores/ticket');

/**
 * The methods exported by TicketActions
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
		id:    { board: boardID },
		token: AuthStore.getToken(),
	}
	var initial = {
		type: Action.LOAD_TICKETS,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess(tickets) {
		return { boardID: boardID, tickets: tickets }
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return { error: err }
	}

	return build(initial, api.getTickets(opts).then(onSuccess, onFailure));
}

/**
 *
 */
function addTicket(boardID, ticket) {
	var opts = {
		id: {
			board: boardID,
		},
		token:   AuthStore.getToken(),
		payload: ticket,
	}
	// We generate a 'mock' id for the ticket so we can be optimistic about
	// adding it to our collection. It is further used to update the ticket's
	// real id once we receive it from the server.
	var initial = {
		payload: {
			ticket: _.assign(ticket, {
				id:        uid(),
				updatedAt: Date.now(),
			}),
			boardID: boardID,
		},
		type: Action.ADD_TICKET,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess(ticket) {
		return {
			boardID: boardID,
			dirtyID: initial.payload.ticket.id,
			cleanID: ticket.id,
		}
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return {
			error:    err,
			boardID:  boardID,
			ticketID: initial.payload.ticket.id,
		}
	}

	return build(initial, api.createTicket(opts).then(onSuccess, onFailure));
}

/**
 *
 */
function editTicket(boardID, ticketID, ticket) {
	// Very simple to roll back changes, if something goes wrong.
	var old = TicketStore.getTicket(boardID, ticketID);

	var opts = {
		id: {
			board:  boardID,
			ticket: ticketID,
		},
		token:   AuthStore.getToken(),
		payload: ticket,
	}
	var initial = {
		payload: {
			ticket: _.assign(ticket, {
				updatedAt: Date.now(),
			}),
			boardID:  boardID,
			ticketID: ticketID,
		},
		type: Action.EDIT_TICKET,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess(ticket) {
		return {
			ticket:   ticket,
			boardID:  boardID,
			ticketID: ticketID,
		}
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return {
			error:    err,
			ticket:   old,
			boardID:  boardID,
			ticketID: ticketID,
		}
	}

	return build(initial, api.updateTicket(opts).then(onSuccess, onFailure));
}

/**
 *
 */
function removeTicket(boardID, ticketID) {
	// Very simple to roll back changes, if something goes wrong.
	var old = TicketStore.getTicket(boardID, ticketID);

	var opts = {
		id: {
			board:  boardID,
			ticket: ticketID,
		},
		token: AuthStore.getToken(),
	}
	var initial = {
		payload: {
			boardID:  boardID,
			ticketID: ticketID,
		},
		type: Action.REMOVE_TICKET,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess() {
		return {
			boardID:  boardID,
			ticketID: ticketID,
		}
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return {
			error:   err,
			ticket:  old,
			boardID: boardID,
		}
	}

	return build(initial, api.deleteTicket(opts).then(onSuccess, onFailure));
}
