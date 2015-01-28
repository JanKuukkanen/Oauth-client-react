'use strict';

var React = require('react/addons');

var Board      = require('../components/board.jsx');
var Ticket     = require('../components/ticket.jsx');
var SideBar    = require('../components/sidebar.jsx');
var Scrollable = require('../components/scrollable.jsx');

var TicketStore   = require('../stores/ticket');
var TicketActions = require('../actions/ticket');

/**
 *
 */
var BoardView = React.createClass({
	propTypes: {
		id: React.PropTypes.string.isRequired,
	},

	getInitialState: function() {
		return {
			width:  1920,
			height: 1080,

			tickets: [ ],
		}
	},

	componentDidMount: function() {
		TicketActions.loadTickets(this.props.id)

		TicketStore.addChangeListener(function() {
			this.setState({
				tickets: TicketStore.getTickets(),
			});
		}.bind(this));
	},

	render: function() {
		var dimensions = {
			width:  this.state.width,
			height: this.state.height,
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
						content={t.content} position={t.position} />
			);
		});
	},
});

module.exports = BoardView;
