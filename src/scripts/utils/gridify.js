import Ticket from '../models/ticket';

/**
 * Snap the given 'position' to a 'grid' specified by ticket dimensions.
 */
export default function gridify(position) {
	return {
		x: Math.round(position.x / Ticket.Width)  * Ticket.Width,
		y: Math.round(position.y / Ticket.Height) * Ticket.Height
	}
}
