import Ticket  from 'models/ticket';
import gridify from 'utils/gridify';

/**
 * The 'gridify' utility snaps positions to an imaginary grid based on the
 * ticket width and height.
 */
describe('utils/gridify', () => {
	it('should not affect coordinates already in grid', () => {
		let zeroed = gridify({ x: 0, y: 0 });

		zeroed.x.should.equal(0);
		zeroed.y.should.equal(0);

		let gridified = gridify({ x: Ticket.Width, y: Ticket.Height });

		gridified.x.should.equal(Ticket.Width);
		gridified.y.should.equal(Ticket.Height);
	});

	it('should snap coordinates towards the closest grid position', () => {
		let position = gridify({
			// Calculate the x value to be less than half of the ticket width.
			x: Ticket.Width - ( (Ticket.Width / 2) + 1 ),
			y: Ticket.Height - 1
		});

		position.x.should.equal(0);
		position.y.should.equal(Ticket.Height);
	})
});
