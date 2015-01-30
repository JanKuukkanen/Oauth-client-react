'use strict';

var Action      = require('../constants/actions');
var Dispatcher  = require('../dispatcher');
var TicketStore = require('../stores/ticket');
var TicketColor = require('../constants/enums').TicketColor;

/**
 * The methods exported by TicketActions
 */
module.exports = {
	addTicket:       addTicket,
	editTicket:      editTicket,
	loadTickets:     loadTickets,
	removeTicket:    removeTicket,
	setActiveTicket: setActiveTicket,
}


////////////////
// MOCKS //
////////////////

var mockTickets = [];
var NUM_TICKETS = 10;

for(var i = 0; i < NUM_TICKETS; i++) {
	mockTickets.push({
		id:      '' + i + '',
		color:   TicketColor.BLUE,
		content: '#' + i + ' content! Long long long sentences... With really longansdajsjdkjajsdjajdkasjkdajsdkkaskdajdskakdasd',
		position: {
			x: Math.round(Math.random() * 1000),
			y: Math.round(Math.random() * 1000),
		},
		updatedAt: Date.now(),
	});
}

var mockID = 10;

////////////////
// MOCKS //
////////////////

function addTicket(ticket) {
	// Generate a random identifier for the ticket.
	// From: https://gist.github.com/gordonbrander/2230317
	var generatedID = Math.random().toString(36).substr(2, 9);

	// For our 'dirty' ticket we use the id we just generated...
	ticket.id = generatedID;

	Dispatcher.dispatch({
		type:    Action.ADD_TICKET,
		payload: ticket,
	});

	// Mock a server response by setting a timeout...
	setTimeout(function() {
		var response = {
			id: '' + (mockID++) + '',
		}
		Dispatcher.dispatch({
			payload: {
				clean: {
					id: response.id,
				},
				dirty: generatedID,
			},
			type: Action.ADD_TICKET_SUCCESS,
		});
	}, 100);
}

/**
 *
 */
function editTicket(ticket) {
	// We get the ticket specified by the given 'ticket.id' from the store, so
	// that if the edit fails, we can just revert to the old one.
	var inStore = TicketStore.getTicket(ticket.id);

	if(!inStore) {
		// To be honest this should never happen...
		return console.error('TicketActions.editTicket: Ticket not found!');
	}

	Dispatcher.dispatch({
		type:    Action.EDIT_TICKET,
		payload: ticket,
	});

	// Mock a server response by setting a timeout...
	setTimeout(function() {
		Dispatcher.dispatch({
			type:    Action.EDIT_TICKET_SUCCESS,
			payload: ticket,
		});
	}, 80);
}

/**
 *
 */
function loadTickets() {
	Dispatcher.dispatch({ type: Action.LOAD_TICKETS });

	// Mock a server response by setting a timeout...
	setTimeout(function() {
		Dispatcher.dispatch({
			type:    Action.LOAD_TICKETS_SUCCESS,
			payload: mockTickets,
		});
	}, 80);
}

/**
 *
 */
function removeTicket(ticket) {
	// We get the ticket specified by the given 'ticket.id' from the store, so
	// that if the removal fails, we can just revert the removal.
	var inStore = TicketStore.getTicket(ticket.id);

	if(!inStore) {
		// To be honest this should never happen...
		return console.error('TicketActions.removeTicket: Ticket not found!');
	}

	Dispatcher.dispatch({
		type:    Action.REMOVE_TICKET,
		payload: ticket,
	});

	// Mock a server response by setting a timeout...
	setTimeout(function() {
		// If we want to emit a failure message, we should emit something like
		// > type: Action.REMOVE_TICKET_FAILURE, payload: inStore
		Dispatcher.dispatch({
			type:    Action.REMOVE_TICKET_SUCCESS,
			payload: ticket,
		});
	}, 80);
}

/**
 *
 */
function setActiveTicket(ticket) {
	Dispatcher.dispatch({
		type:    Action.SET_ACTIVE_TICKET,
		payload: ticket,
	});
}
