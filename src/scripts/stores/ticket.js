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
			_calculateZLayers();
			this.emitChange();
			break;

		case Action.ADD_TICKET:
			_addTicket(action.payload);
			this.emitChange();
			break;

		case Action.ADD_TICKET_SUCCESS:
			_update(_index(action.payload.dirty), action.payload.clean);
			_calculateZLayers();
			this.emitChange();
			break;

		case Action.EDIT_TICKET:
			_update(_index(action.payload.id), action.payload);
			_calculateZLayers();
			this.emitChange();
			break;

		case Action.REMOVE_TICKET:
			_remove(_index(action.payload.id));
			this.emitChange();
			break;

		case Action.SET_TICKET_ACTIVE:
			_active = action.payload.id;
			this.emitChange();
			break;
	}
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

/**
 *
 */
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
 * Used to calculate the 'position.z' property for tickets, which only exists
 * on the client. This is so that we don't constantly change the order of our
 * tickets, because it can cause issues with rendering.
 *
 * TODO Can this be optimized?
 */
function _calculateZLayers() {
	// First we sort the tickets by their 'updatedAt' property, since it tells
	// us which order should the tickets have.
	var sorted = _tickets.sortBy(function(ticket) {
		return ticket.updatedAt;
	}).toArray();

	// Map IDs to their respective 'z-indices'.
	var zLayer = { }
	for(var i = 0; i < sorted.length; i++) {
		zLayer[sorted[i].id] = i;
	}

	// Finally we perform a simple map, which adds a 'z' attribute to the
	// position property of tickets.
	_tickets = _tickets.map(function(ticket) {
		ticket.position.z = zLayer[ticket.id];
		return ticket;
	});
}

/**
 * Remove the ticket at the given index.
 */
function _remove(index) {
	_tickets = _tickets.remove(index);
}
