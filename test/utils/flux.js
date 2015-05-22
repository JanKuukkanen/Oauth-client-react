let flux = reqmod('utils/flux');

/**
 * The 'flux' utility abstracts away some of the more tedious parts of the flux
 * architecture implementation.
 */
describe('utils/flux', () => {

	describe('#store', () => {

	});

	/**
	 * The 'actions' function is used to define the different actions available
	 * in the application.
	 */
	describe('#actions', () => {
		it('should return a copy of the given object', () => {
			let target  = { };
			let actions = flux.actions(target);

			return target.should.not.be.equal(actions);
		});

		it('should replace the values with the \'path\'', () => {
			let target = { Board: { Create: null }, Ticket: { Remove: null } }
			let Action = flux.actions(target);

			Action.Board.Create.should.equal('BOARD_CREATE');
			Action.Ticket.Remove.should.equal('TICKET_REMOVE');
		});

		it('should allow a custom \'prefix\' for the actions', () => {
			let target = { Board: { Create: null }, Ticket: { Remove: null } }
			let Action = flux.actions(target, 'CUSTOM');

			Action.Board.Create.should.equal('CUSTOM_BOARD_CREATE');
			Action.Ticket.Remove.should.equal('CUSTOM_TICKET_REMOVE');
		});

		it('should generate async actions', () => {
			let target = { Board: { Create: true } }
			let Action = flux.actions(target);

			Action.Board.Create.should.equal('BOARD_CREATE');
			Action.Board.Create.Success.should.equal('BOARD_CREATE_SUCCESS');
			Action.Board.Create.Failure.should.equal('BOARD_CREATE_FAILURE');
		});
	});

	describe('#actionCreator', () => {

	});
});
