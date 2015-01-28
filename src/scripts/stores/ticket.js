'use strict';

var Immutable = require('immutable');

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

/**
 * A list of tickets.
 */
var _tickets = Immutable.List([]);

/**
 * Describes the TicketStore API available for consumption.
 */
var TicketStoreAPI = {
	getTickets: getTickets,
}

/**
 * A store of tickets.
 */
module.exports = createStore(TicketStoreAPI, function(action) {
	switch(action.type) {

		case Action.LOAD_TICKETS_SUCCESS:
			_tickets = Immutable.List(action.payload);
			break;

		case Action.EDIT_TICKET:
			console.log('hep');

			var index = _tickets.findIndex(function(ticket) {
				return ticket.id === action.payload.id;
			});
			_tickets = _tickets.update(index, function(ticket) {
				ticket.color    = action.payload.color    || ticket.color;
				ticket.content  = action.payload.content  || ticket.content;
				ticket.position = action.payload.position || ticket.position;
				return ticket;
			});
			break;
	}
	return this.emitChange();
});

/**
 * Get the tickets currently in store.
 */
function getTickets() {
	return _tickets.toArray();
}
