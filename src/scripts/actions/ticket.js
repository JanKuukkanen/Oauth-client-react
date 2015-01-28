'use strict';

var Action      = require('../constants/actions');
var Dispatcher  = require('../dispatcher');
var TicketColor = require('../constants/enums').TicketColor;

/**
 * The methods exported by TicketActions
 */
module.exports = {
	moveTicket:  moveTicket,
	loadTickets: loadTickets,
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
		}
	});
}

////////////////
// MOCKS //
////////////////

/**
 *
 */
function moveTicket(ticket) {
	Dispatcher.dispatch({
		type:    Action.EDIT_TICKET,
		payload: ticket,
	});

	// Mock a server response by setting a timeout
	setTimeout(function() {
		Dispatcher.dispatch({
			type:    Action.EDIT_TICKET_SUCCESS,
			payload: ticket,
		});
	}.bind(this), 80);
}

/**
 *
 */
function loadTickets() {
	Dispatcher.dispatch({ type: Action.LOAD_TICKETS });

	// Mock a server response by setting a timeout
	setTimeout(function() {
		Dispatcher.dispatch({
			type:    Action.LOAD_TICKETS_SUCCESS,
			payload: mockTickets,
		});
	}.bind(this), 80);
}
