'use strict';

var _     = require('lodash');
var page  = require('page');
var React = require('react');

var Board           = require('../components/board.jsx');
var Ticket          = require('../components/ticket.jsx');
var Control         = require('../components/control');
var Broadcast       = require('../components/broadcast.jsx');
var Navigation      = require('../components/navigation.jsx');
var Scrollable      = require('../components/scrollable.jsx');
var EditBoardDialog = require('../components/dialog/edit-board');

var StateStore    = require('../stores/state');
var BoardStore    = require('../stores/board');
var TicketStore   = require('../stores/ticket');
var BoardActions  = require('../actions/board');
var StateActions  = require('../actions/state');
var TicketActions = require('../actions/ticket');

var Default = require('../constants/defaults');

var resize     = require('../utils/resize');
var markers    = require('../utils/create-markers');
var listener   = require('../mixins/listener');
var background = require('../utils/background');

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
		listener([ StateStore, BoardStore, TicketStore ]),
	],

	propTypes: {
		id: React.PropTypes.string.isRequired,
	},

	getState: function() {
		return {
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
		return _.extend(this.getState(), {
			showEditBoardDialog: false
		});
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

	_showEditBoardDialog: function() {
		return this.setState({
			showEditBoardDialog: !this.state.showEditBoardDialog
		});
	},

	render: function() {
		var minimapOpts = {
			show:       this.state.showMinimap,
			background: background(this.state.board),
		}
		var editBoardDialog = !this.state.showEditBoardDialog ? null : (
			/* jshint ignore:start */
			<EditBoardDialog board={this.state.board} onDismiss={this._showEditBoardDialog} />
			/* jshint ignore:end */
		);
		return (
			/* jshint ignore:start */
			<div className="view view-board">
				<Navigation title={this.state.board.name} />
				<div className="content">
					<Scrollable size={this.state.board.size} markers={markers(this.state.tickets)}
							minimap={minimapOpts}>
						<Board board={this.state.board} snap={this.state.snapToGrid}>
							{this.renderTickets()}
						</Board>
					</Scrollable>
				</div>
				{editBoardDialog}
				{this.renderControls()}
			</div>
			/* jshint ignore:end */
		);
	},

	/**
	 * NOTE This is a clusterfuck beyond any control holy hell should this be
	 *      cleaned up or what. It Just Works.
	 */
	renderControls: function() {
		var controls = [{
			icon: 'arrow-left',
			onClick: function() {
				return page.back('/boards');
			}
		}, {
			icon: 'pencil',
			active: this.state.showEditBoardDialog,
			onClick: this._showEditBoardDialog,
		}, {
			icon: 'magnet',
			active: this.state.snapToGrid,
			onClick: function() {
				StateActions.setSetting(
					'snapToGrid', !this.state.snapToGrid
				);
			}.bind(this)
		}, {
			icon: 'globe',
			active: this.state.showMinimap,
			onClick: function() {
				StateActions.setSetting(
					'showMinimap', !this.state.showMinimap
				);
			}.bind(this)
		}];
		return (
			/* jshint ignore:start */
			<div className="controls">
				{controls.map(function(ctrl, index) {
					return (
						<Control key={index} {...ctrl} />
					);
				})}
			</div>
			/* jshint ignore:end */
		);
	},

	/**
	 *
	 */
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
