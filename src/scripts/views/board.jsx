'use strict';

var React = require('react');

var Board      = require('../components/board.jsx');
var Ticket     = require('../components/ticket.jsx');
var Setting    = require('../components/setting.jsx');
var Sidebar    = require('../components/sidebar.jsx');
var Scrollable = require('../components/scrollable.jsx');

var AuthStore   = require('../stores/auth');
var DataStore   = require('../stores/data');
var StateStore  = require('../stores/state');
var DataActions = require('../actions/data');

var TICKET_WIDTH  = require('../constants').TICKET_WIDTH;
var TICKET_HEIGHT = require('../constants').TICKET_HEIGHT;

/**
 * Fix issues with iOS and scrolling causing bouncing.
 */
function _preventBounce(ev) {
	return ev.preventDefault();
}

/**
 *
 */
function _upsize(board) {
	board.size.width  = board.size.width  * TICKET_WIDTH;
	board.size.height = board.size.height * TICKET_HEIGHT;
	return board;
}

/**
 *
 */
var BoardView = React.createClass({
	propTypes: {
		/**
		 * The 'id' of the board we want to view.
		 */
		id: React.PropTypes.string.isRequired,
	},

	getInitialState: function() {
		return {
			user:    AuthStore.getUser(),
			board:   _upsize(DataStore.getBoard(this.props.id)),
			tickets: DataStore.getTickets(this.props.id),

			snapToGrid:   StateStore.getSetting('snapToGrid'),
			showMinimap:  StateStore.getSetting('showMinimap'),
			activeTicket: StateStore.getActiveTicket(),
		}
	},

	componentDidMount: function() {
		AuthStore.addChangeListener(this._onAuthStoreChange);
		DataStore.addChangeListener(this._onDataStoreChange);
		StateStore.addChangeListener(this._onStateStoreChange);

		DataActions.loadBoards();
		DataActions.loadTickets(this.props.id);

		return document.addEventListener('touchmove', _preventBounce);
	},

	componentWillUnmount: function() {
		AuthStore.removeChangeListener(this._onAuthStoreChange)
		DataStore.removeChangeListener(this._onDataStoreChange);
		StateStore.removeChangeListener(this._onStateStoreChange);

		return document.removeEventListener('touchmove', _preventBounce);
	},

	_onAuthStoreChange: function() {
		this.setState({
			user: AuthStore.getUser(),
		});
	},

	_onDataStoreChange: function() {
		return this.setState({
			board:   _upsize(DataStore.getBoard(this.props.id)),
			tickets: DataStore.getTickets(this.props.id),
		});
	},

	_onStateStoreChange: function() {
		return this.setState({
			snapToGrid:   StateStore.getSetting('snapToGrid'),
			showMinimap:  StateStore.getSetting('showMinimap'),
			activeTicket: StateStore.getActiveTicket(),
		});
	},

	render: function() {
		var markers = this.state.tickets.map(function(t) {
			return {
				size: {
					width:  TICKET_WIDTH,
					height: TICKET_HEIGHT,
				},
				position: {
					x: t.position.x,
					y: t.position.y,
					z: t.position.z,
				},
				color: t.color,
			}
		});
		return (
			/* jshint ignore:start */
			<div className="application">
				<Sidebar user={this.state.user} />
				<div className="view view-board">
					<div className="options">
						{this.renderSettings()}
					</div>
					<Scrollable size={this.state.board.size}
							markers={markers}
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
		var settings = [
			{
				key:   'snapToGrid',
				icon:  'th',
				value: this.state.snapToGrid,
			},
			{
				key:   'showMinimap',
				icon:  'globe',
				value: this.state.showMinimap,
			}
		];
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
