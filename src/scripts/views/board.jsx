'use strict';

var React = require('react');

var Board      = require('../components/board.jsx');
var Ticket     = require('../components/ticket.jsx');
var Setting    = require('../components/setting.jsx');
var Sidebar    = require('../components/sidebar.jsx');
var Scrollable = require('../components/scrollable.js');

var AuthStore    = require('../stores/auth');
var BoardStore   = require('../stores/board');
var TicketStore  = require('../stores/ticket');
var SettingStore = require('../stores/setting');

var AuthActions   = require('../actions/auth');
var BoardActions  = require('../actions/board');
var TicketActions = require('../actions/ticket');

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
var BoardView = React.createClass({
	propTypes: {
		/**
		 * The 'id' of the board we want to view.
		 */
		id: React.PropTypes.string.isRequired,
	},

	getInitialState: function() {
		return {
			user: AuthStore.getUser(),
			board: BoardStore.getBoard(this.props.id) || {
				size: {
					width:  10,
					height: 10,
				},
				background: '',
			},
			tickets: [ ],

			/**
			 * We keep track of the ticket the user last clicked, so we can
			 * highlight it by raising it on top of other tickets.
			 */
			lastActiveTicket: null,

			snapToGrid:  SettingStore.get('snapToGrid'),
			showMinimap: SettingStore.get('showMinimap'),
		}
	},

	componentDidMount: function() {
		// Fix for bouncing on iOS. No scrolling here!
		document.addEventListener('touchmove', _preventBounce);

		BoardStore.addChangeListener(this._onBoardStoreChange);
		TicketStore.addChangeListener(this._onTicketStoreChange);
		SettingStore.addChangeListener(this._onSettingStoreChange);

		BoardActions.loadBoards();
		TicketActions.loadTickets(this.props.id);
	},

	componentWillUnmount: function() {
		document.removeEventListener('touchmove', _preventBounce);

		BoardStore.removeChangeListener(this._onBoardStoreChange);
		TicketStore.removeChangeListener(this._onTicketStoreChange);
		SettingStore.removeChangeListener(this._onSettingStoreChange);
	},

	_onBoardStoreChange: function() {
		this.setState({
			board: BoardStore.getBoard(this.props.id),
		});
	},

	_onTicketStoreChange: function() {
		this.setState({
			tickets:          TicketStore.getTickets(),
			lastActiveTicket: TicketStore.getActiveTicket(),
		});
	},

	_onSettingStoreChange: function() {
		this.setState({
			snapToGrid:  SettingStore.get('snapToGrid'),
			showMinimap: SettingStore.get('showMinimap'),
		});
	},

	render: function() {
		var dimensions = {
			width:  this.state.board.size.width  * TICKET_WIDTH,
			height: this.state.board.size.height * TICKET_HEIGHT,
		}
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
			<div className="application">
				<Sidebar user={this.state.user} />
				<div className="view view-board">
					<div className="options">
						{this.renderSettings()}
					</div>
					<Scrollable size={dimensions} markers={markers}
							minimap={this.state.showMinimap}>
						<Board size={dimensions} snap={this.state.snapToGrid}>
							{this.renderTickets()}
						</Board>
					</Scrollable>
				</div>
			</div>
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
				<Setting key={setting.key}
					icon={setting.icon} value={setting.value} />
			);
		});
	},

	renderTickets: function() {
		return this.state.tickets.map(function(t) {
			return (
				<Ticket key={t.id}
					id={t.id}
					snap={this.state.snapToGrid}
					color={t.color}
					active={t.id === this.state.lastActiveTicket}
					content={t.content}
					position={t.position} />
			);
		}.bind(this));
	},
});

module.exports = BoardView;
