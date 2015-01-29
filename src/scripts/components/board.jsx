'use strict';

var React  = require('react');
var Hammer = require('hammerjs');

var TicketColor   = require('../constants/enums').TicketColor;
var TicketActions = require('../actions/ticket');

var gridify = require('../utils/gridify');

var TICKET_WIDTH  = require('../constants').TICKET_WIDTH;
var TICKET_HEIGHT = require('../constants').TICKET_HEIGHT;

var Board = React.createClass({
	propTypes: {
		/**
		 * The 'snap' property indicates whether or not tickets will snap on
		 * the board. Note that here the snap property is used to determine
		 * where a ticket should be created.
		 */
		snap: React.PropTypes.bool,

		/**
		 * The 'size' property indicates the pixel size of the board.
		 */
		size: React.PropTypes.shape({
			width:  React.PropTypes.number,
			height: React.PropTypes.number,
		}).isRequired,

		/**
		 * The 'sideBarWidth' property indicates the current width of the
		 * sidebar. We need it for calculations and stuff...
		 */
		sideBarWidth: React.PropTypes.number,
	},

	getDefaultProps: function() {
		return {
			snap:         false,
			sideBarWidth: 80,
		}
	},

	componentDidMount: function() {
		this.hammer = new Hammer.Manager(this.getDOMNode());
		this.hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));

		// Setup a listener for our custom 'doubletap' event, which is used
		// here to add new tickets.
		this.hammer.on('doubletap', function addTicket(ev) {
			// We need to take into account the static sidebar when calculating
			// the pointer position.
			ev.center.x = ev.center.x - this.props.sideBarWidth;

			// Calculate the position to be at the center of the ticket. Note
			// that since 'board' is actually embedded inside a scrollable, we
			// receive an undocumented 'offset' property, which tells us where
			// we have scrolled on the board.
			var pos = {
				x: (ev.center.x - this.props.offset.x) - (TICKET_WIDTH / 2),
				y: (ev.center.y - this.props.offset.y) - (TICKET_HEIGHT / 2),
			}

			// The position is just an illusion... If we have snap on...
			var endpos = this.props.snap ? gridify(pos) : pos;

			// Clamp the position so that it does not go out of bounds...
			endpos.x = endpos.x < 0 ?
				0 : ((endpos.x + TICKET_WIDTH) > this.props.size.width ?
					(this.props.size.width - TICKET_WIDTH) : endpos.x);

			endpos.y = endpos.y < 0 ?
				0 : ((endpos.y + TICKET_HEIGHT) > this.props.size.height ?
					(this.props.size.height - TICKET_HEIGHT) : endpos.y);

			// We're done!
			TicketActions.addTicket({
				color:    TicketColor.VIOLET,
				content:  '',
				position: endpos,
			});
		}.bind(this));
	},

	render: function() {
		return (
			<div className="board" style={this.props.size}>
				{this.props.children}
			</div>
		);
	},
});

module.exports = Board;
