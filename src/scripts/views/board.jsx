'use strict';

var React = require('react');

var Board      = require('../components/board.jsx');
var Ticket     = require('../components/ticket.jsx');
var Setting    = require('../components/setting.jsx');
var Sidebar    = require('../components/sidebar.jsx');
var Scrollable = require('../components/scrollable.jsx');

var TicketStore   = require('../stores/ticket');
var SettingStore  = require('../stores/setting');
var TicketActions = require('../actions/ticket');

var TICKET_WIDTH  = require('../constants').TICKET_WIDTH;
var TICKET_HEIGHT = require('../constants').TICKET_HEIGHT;

/**
 *
 */
var BoardView = React.createClass({
	getInitialState: function() {
		return {
			width:  12,
			height: 15,

			active:  null,
			tickets: [ ],

			snapToGrid:  SettingStore.get('snapToGrid'),
			showMinimap: SettingStore.get('showMinimap'),
		}
	},

	componentDidMount: function() {
		TicketActions.loadTickets(this.props.id);

		TicketStore.addChangeListener(this._ticketStoreChangeListener);
		SettingStore.addChangeListener(this._settingStoreChangeListener);
	},

	componentWillUnmount: function() {
		TicketStore.removeChangeListener(this._ticketStoreChangeListener);
		SettingStore.removeChangeListener(this._settingStoreChangeListener);
	},

	_ticketStoreChangeListener: function() {
		this.setState({
			active:  TicketStore.getActiveTicket(),
			tickets: TicketStore.getTickets(),
		});
	},

	_settingStoreChangeListener: function() {
		this.setState({
			snapToGrid:  SettingStore.get('snapToGrid'),
			showMinimap: SettingStore.get('showMinimap'),
		});
	},

	render: function() {
		var dimensions = {
			width:  this.state.width  * TICKET_WIDTH,
			height: this.state.height * TICKET_HEIGHT,
		}
		return (
			<div className="application">
				<Sidebar user={this.props.user} />
				<div className="view view-board">
					<div className="options">
						{this.renderSettings()}
					</div>
					<Scrollable size={dimensions} markers={this.state.tickets}
							showMinimap={this.state.showMinimap}>
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
					active={t.id === this.state.active}
					content={t.content}
					position={t.position} />
			);
		}.bind(this));
	},
});

module.exports = BoardView;
