'use strict';

var React = require('react');

var Board      = require('../components/board.jsx');
var Ticket     = require('../components/ticket.jsx');
var Setting    = require('../components/setting.jsx');
var Sidebar    = require('../components/sidebar.jsx');
var Scrollable = require('../components/scrollable.jsx');

var AuthStore     = require('../stores/auth');
var StateStore    = require('../stores/state');
var BoardStore    = require('../stores/board');
var TicketStore   = require('../stores/ticket');
var BoardActions  = require('../actions/board');
var TicketActions = require('../actions/ticket');

var resize   = require('../utils/resize');
var markers  = require('../utils/create-markers');
var listener = require('../mixins/listener');
var Default  = require('../constants/defaults');

/**
 * Fix issues with iOS and scrolling causing bouncing.
 *
 * TODO This should become deprecated as soon as we convert the workspace to be
 *      a Scrollable element also.
 */
function _preventBounce(ev) {
	return ev.preventDefault();
}

/**
 * Displays an interactive, scrollable view with tickets that can be created,
 * removed and edited.
 *
 * @param {string} id  The 'id' attribute of the Board we want to view.
 */
var BoardView = React.createClass({
	mixins: [
		listener([ AuthStore, StateStore, BoardStore, TicketStore ]),
	],

	propTypes: {
		id: React.PropTypes.string.isRequired,
	},

	getState: function() {
		return {
			user: AuthStore.getUser(),
			board: resize(
				BoardStore.getBoard(this.props.id) || Default.BOARD
			),
			tickets: TicketStore.getTickets(this.props.id),

			snapToGrid:   StateStore.getSetting('snapToGrid'),
			showMinimap:  StateStore.getSetting('showMinimap'),
			activeTicket: StateStore.getActiveTicket(),
		}
	},

	getInitialState: function() {
		return this.getState();
	},

	onChange: function() {
		return this.setState(this.getState());
	},

	componentDidMount: function() {
		BoardActions.loadBoard(this.props.id);
		TicketActions.loadTickets(this.props.id);

		return document.addEventListener('touchmove', _preventBounce);
	},

	componentWillUnmount: function() {
		return document.removeEventListener('touchmove', _preventBounce);
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className="application">
				<Sidebar user={this.state.user} />
				<div className="view view-board">
					<div className="options">
						{this.renderSettings()}
					</div>
					<Scrollable size={this.state.board.size}
							markers={markers(this.state.tickets)}
							minimap={this.state.showMinimap}>
						<Board board={this.state.board}
								snap={this.state.snapToGrid}>
							{this.renderTickets()}
						</Board>
					</Scrollable>
				</div>
			</div>
			/* jshint ignore:end */
		);
	},

	renderSettings: function() {
		var settings = [{
			key:   'snapToGrid',
			icon:  'th',
			value: this.state.snapToGrid,
		}, {
			key:   'showMinimap',
			icon:  'globe',
			value: this.state.showMinimap,
		}];
		return settings.map(function(setting) {
			return (
				/* jshint ignore:start */
				<Setting key={setting.key}
					icon={setting.icon}
					value={setting.value} />
				/* jshint ignore:end */
			);
		});
	},

	renderTickets: function() {
		return this.state.tickets.map(function(ticket) {
			return (
				/* jshint ignore:start */
				<Ticket key={ticket.id} ticket={ticket} boardID={this.props.id}
					snap={this.state.snapToGrid}
					active={ticket.id === this.state.activeTicket} />
				/* jshint ignore:end */
			);
		}.bind(this));
	},
});

module.exports = BoardView;
