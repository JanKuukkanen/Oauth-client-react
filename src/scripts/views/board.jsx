'use strict';

var React = require('react/addons');

var Board      = require('../components/board.jsx');
var Ticket     = require('../components/ticket.jsx');
var SideBar    = require('../components/sidebar.jsx');
var Scrollable = require('../components/scrollable.jsx');

var TicketStore   = require('../stores/ticket');
var TicketActions = require('../actions/ticket');

var TICKET_WIDTH  = require('../constants').TICKET_WIDTH;
var TICKET_HEIGHT = require('../constants').TICKET_HEIGHT;

/**
 *
 */
var BoardView = React.createClass({
	propTypes: {
		id: React.PropTypes.string.isRequired,
	},

	getInitialState: function() {
		return {
			width:  10,
			height: 10,

			active:  null,
			tickets: [ ],
		}
	},

	componentDidMount: function() {
		TicketActions.loadTickets(this.props.id)

		TicketStore.addChangeListener(function() {
			this.setState({
				active:  TicketStore.getActiveTicket(),
				tickets: TicketStore.getTickets(),
			});
		}.bind(this));
	},

	render: function() {
		var dimensions = {
			width:  this.state.width  * TICKET_WIDTH,
			height: this.state.height * TICKET_HEIGHT,
		}
		return (
			<div className="board-view">
				<SideBar />
				<Scrollable size={dimensions}>
					<Board size={dimensions}>
						{this.renderTickets()}
					</Board>
				</Scrollable>
			</div>
		);
	},

	renderTickets: function() {
		return this.state.tickets.map(function(t) {
			return (
				<Ticket key={t.id} id={t.id} color={t.color}
					active={t.id === this.state.active}
					content={t.content} position={t.position} />
			);
		}.bind(this));
	},
});

module.exports = BoardView;
