'use strict';

var React  = require('react');
var Hammer = require('hammerjs');

var Property    = require('../constants/property');
var Background  = require('../constants/enums').Background;
var TicketColor = require('../constants/enums').TicketColor;

var gridify       = require('../utils/gridify');
var doubletap     = require('../utils/doubletap');
var background    = require('../utils/background');
var TicketActions = require('../actions/ticket');

var TICKET_WIDTH  = require('../constants').TICKET_WIDTH;
var TICKET_HEIGHT = require('../constants').TICKET_HEIGHT;

/**
 * Surface with a background and a specific size. Clicking on the surface
 * creates a new 'Ticket'.
 */
var Board = React.createClass({
	propTypes: {
		/**
		 * The 'snap' property indicates whether to snap created tickets to a
		 * grid of 'ticket.width' x 'ticket.height'.
		 */
		snap: React.PropTypes.bool,

		/**
		 * The 'board' we are representing.
		 */
		board: Property.Board.isRequired,
	},

	getDefaultProps: function() {
		return {
			snap: false,
		}
	},

	componentDidMount: function() {
		this.hammer = doubletap(this.getDOMNode());

		// Setup a listener for our custom 'doubletap' event, which is used
		// here to add new tickets.
		this.hammer.on('doubletap', function addTicket(ev) {
			// Take into account the height of the Navigation bar...
			ev.center.y = ev.center.y - 64;

			// Calculate the position to be at the center of the ticket. Since
			// the 'Board' component is wrapped by a 'Scrollable', we receive
			// an 'offset' property.
			// If the user has enabled snapping, we also need to make sure to
			// snap the position to a grid.
			var pos = {
				x: (ev.center.x - this.props.offset.x) - (TICKET_WIDTH / 2),
				y: (ev.center.y - this.props.offset.y) - (TICKET_HEIGHT / 2),
			}

			var endpos    = this.props.snap ? gridify(pos) : pos;
			var boardSize = this.props.board.size;

			// Finally we need to clamp the position so that it does not go
			// over the bounds of the board.

			endpos.x = endpos.x < 0 ?
				0 : ((endpos.x + TICKET_WIDTH) > boardSize.width ?
					(boardSize.width - TICKET_WIDTH) : endpos.x);

			endpos.y = endpos.y < 0 ?
				0 : ((endpos.y + TICKET_HEIGHT) > boardSize.height ?
					(boardSize.height - TICKET_HEIGHT) : endpos.y);

			return TicketActions.addTicket(this.props.board.id, {
				color:    TicketColor.VIOLET,
				content:  '',
				position: endpos,
			});
		}.bind(this));
	},

	render: function() {
		var style = {
			width:           this.props.board.size.width,
			height:          this.props.board.size.height,
			backgroundImage: background(this.props.board),
		}
		return (
			/* jshint ignore:start */
			<div className="board" style={style}>
				{this.props.children}
			</div>
			/* jshint ignore:end */
		);
	},
});

module.exports = Board;
