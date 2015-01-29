'use strict';

var Immutable = require('immutable');

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

/**
 * The ticket that was last active.
 */
var _active = null;

/**
 * A list of tickets.
 */
var _tickets = Immutable.List([]);

/**
 * Describes the TicketStore API available for consumption.
 */
var TicketStoreAPI = {
	getTicket:       getTicket,
	getTickets:      getTickets,
	getActiveTicket: getActiveTicket,
}

/**
 * A store of tickets.
 */
module.exports = createStore(TicketStoreAPI, function(action) {
	switch(action.type) {

		case Action.LOAD_TICKETS_SUCCESS:
			_initialize(action.payload);
			_sortByDate();
			break;

		case Action.ADD_TICKET:
			_addTicket(action.payload);
			break;

		case Action.ADD_TICKET_SUCCESS:
			_update(_index(action.payload.dirty), action.payload.clean);
			_sortByDate();
			break;

		case Action.EDIT_TICKET:
			_update(_index(action.payload.id), action.payload);
			_sortByDate();
			break;

		case Action.REMOVE_TICKET:
			_remove(_index(action.payload.id));
			break;

		case Action.SET_ACTIVE_TICKET:
			_active = action.payload.id;
			break;
	}
	return this.emitChange();
});

/**
 * Get the ticket with the same 'id.server' as 'id'.
 */
function getTicket(id) {
	return _tickets.find(function(t) {
		return t.id === id;
	});
}

/**
 * Get the tickets currently in store.
 */
function getTickets() {
	return _tickets.toArray();
}

/**
 * Get the currently 'active' ticket.
 */
function getActiveTicket() {
	return _active;
}

/**
 *
 */
function _initialize(tickets) {
	_tickets = Immutable.List(tickets);
}

function _addTicket(ticket) {
	_tickets = _tickets.push(ticket);
}

/**
 *
 */
function _sortByDate() {
	_tickets = _tickets.sortBy(function(t) {
		return t.updatedAt;
	});
}

/**
 * Get the index of the ticket specified by the given 'id'.
 */
function _index(id) {
	return _tickets.findIndex(function(t) {
		return t.id === id;
	});
}

/**
 * Update the ticket at the given 'index'.
 */
function _update(index, ticket) {
	_tickets = _tickets.update(index, function(t) {
		t.id       = ticket.id       || t.id;
		t.color    = ticket.color    || t.color;
		t.content  = ticket.content  || t.content;
		t.position = ticket.position || t.position;

		t.updatedAt = Date.now();
		return t;
	});
}

/**
 * Remove the ticket at the given index.
 */
function _remove(index) {
	_tickets = _tickets.remove(index);
}
