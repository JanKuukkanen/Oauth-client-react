'use strict';

var TicketStore   = require('../../src/scripts/stores/ticket');
var TicketActions = require('../../src/scripts/actions/ticket');

describe('TicketStore', function() {
	it('should emit change', function(done) {
		TicketActions.loadTickets();
		TicketStore.addChangeListener(done);
	});

	describe('.getTickets', function() {
		it('should return a plain Array', function() {
			TicketStore.getTickets().should.be.an.Array;
		});
	});
});
