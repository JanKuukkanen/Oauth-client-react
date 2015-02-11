'use strict';

var _         = require('lodash');
var Immutable = require('immutable');

var Action      = require('../constants/actions');
var Default     = require('../constants/defaults');
var createStore = require('../utils/create-store');

/**
 *
 */
var TicketStoreAPI = {
	getTicket:  getTicket,
	getTickets: getTickets,
}

/**
 * Tickets mapped to their respective boards.
 */
var _ticketMap = Immutable.Map({});

/**
 * Get the 'tickets' of the specified Board.
 */
function getTickets(boardID) {
	if(_ticketMap.has(boardID)) {
		return _ticketMap.get(boardID).toJS();
	}
	return [ ];
}

/**
 * Get a specific Ticket.
 */
function getTicket(boardID, ticketID) {
	if(_ticketMap.has(boardID)) {
		var ticket = _ticketMap.get(boardID).find(function(t) {
			return t.get('id') === ticketID;
		});
		return ticket ? ticket.toJS() : null;
	}
	return null;
}

/**
 * Get the index of the model with given 'id' from the given collection.
 */
function _index(id, collection) {
	return collection.findIndex(function(m) {
		return m.get('id') === id;
	});
}

/**
 * Small helper to create an immutable version of a Ticket from plain JS. Do
 * note that this does not create a 'position.z'.
 */
function _ticket(payload, defaults) {
	defaults = _.defaults(defaults || Default.TICKET, Default.TICKET);

	return Immutable.Map({
		id:      payload.id      || defaults.id,
		color:   payload.color   || defaults.color,
		content: payload.content || defaults.content,

		position: Immutable.Map({
			x: payload.position ? payload.position.x : defaults.position.x,
			y: payload.position ? payload.position.y : defaults.position.y,
		}),

		updatedAt: payload.updatedAt || defaults.updatedAt,
	});
}

/**
 * Maps the IDs of the given tickets to indices based on the 'updatedAt'
 * attribute of each ticket. Then calculates the 'position.z' value for each
 * ticket in the passed in collection.
 */
function _calculateZPositionsFor(tickets) {
	var zmap = tickets.sortBy(function(t) { return t.get('updatedAt'); })
		.map(function(t) { return t.get('id'); }).toMap().flip();
	return tickets.map(function(t) {
		return t.setIn(['position', 'z'], zmap.get(t.get('id')));
	});
}

/**
 * Adds the given tickets to the specified board.
 */
function _addTicket(boardID, ticket, ticketMap) {
	if(ticket instanceof Array) {
		return ticketMap.set(boardID,
			_calculateZPositionsFor(Immutable.List(ticket.map(_ticket))));
	}
	// Make sure we don't overwrite anything, just append.
	var existing = ticketMap.get(boardID) || Immutable.List([]);
	// We set the 'position.z' value for the new ticket to be on top of every
	// other ticket already in the collection.
	return ticketMap.set(boardID, existing.push(
		_ticket(ticket).setIn(['position', 'z'], existing.size)
	));
}

/**
 * Updates the specified ticket at the specified board.
 */
function _editTicket(boardID, ticketID, ticket, ticketMap) {
	if(ticketMap.has(boardID)) {
		var tickets     = ticketMap.get(boardID);
		var ticketIndex = _index(ticketID, tickets);

		// If the ticket is not found in the specified collection, do nothing.
		if(ticketIndex < 0) {
			return ticketMap;
		}
		tickets = tickets.update(ticketIndex, function(old) {
			return _ticket(ticket, old.toJS());
		});
		return ticketMap.set(boardID, _calculateZPositionsFor(tickets));
	}
	return ticketMap;
}

/**
 * Removes the specified ticket from the specified board.
 */
function _removeTicket(boardID, ticketID, ticketMap) {
	if(ticketMap.has(boardID)) {
		var tickets     = ticketMap.get(boardID);
		var ticketIndex = _index(ticketID, tickets);

		// If the ticket is not found in the specified collection, do nothing.
		if(ticketIndex < 0) {
			return ticketMap;
		}
		return ticketMap.set(boardID, tickets.remove(ticketIndex));
	}
	return ticketMap;
}


module.exports = createStore(TicketStoreAPI, function(action) {
	switch(action.type) {
		case Action.LOAD_TICKETS_SUCCESS:
			_ticketMap = _addTicket(
				action.payload.boardID,
				action.payload.tickets,
				_ticketMap
			);
			this.emitChange();
			break;

		case Action.ADD_TICKET:
			_ticketMap = _addTicket(
				action.payload.boardID,
				action.payload.ticket,
				_ticketMap
			);
			this.emitChange();
			break;
		case Action.ADD_TICKET_SUCCESS:
			_ticketMap = _editTicket(
				action.payload.boardID,
				action.payload.dirtyID,
				{ id: action.payload.cleanID },
				_ticketMap
			);
			this.emitChange();
			break;
		case Action.ADD_TICKET_FAILURE:
			_ticketMap = _removeTicket(
				action.payload.boardID,
				action.payload.ticketID,
				_ticketMap
			);
			this.emitChange();
			break;

		case Action.EDIT_TICKET:
		case Action.EDIT_TICKET_FAILURE:
			_ticketMap = _editTicket(
				action.payload.boardID,
				action.payload.ticketID,
				action.payload.ticket,
				_ticketMap
			);
			this.emitChange();
			break;

		case Action.REMOVE_TICKET:
			_ticketMap = _removeTicket(
				action.payload.boardID,
				action.payload.ticketID,
				_ticketMap
			);
			this.emitChange();
			break;
		case Action.REMOVE_TICKET_FAILURE:
			_ticketMap = _addTicket(
				action.payload.boardID,
				action.payload.ticket,
				_ticketMap
			);
			this.emitChange();
			break;
	}
});
