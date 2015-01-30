'use strict';

var React = require('react/addons');

var Board      = require('../components/board.jsx');
var Ticket     = require('../components/ticket.jsx');
var Setting    = require('../components/setting.jsx');
var SideBar    = require('../components/sidebar.jsx');
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
	propTypes: {
		id: React.PropTypes.string.isRequired,
	},

	getInitialState: function() {
		return {
			width:  10,
			height: 10,

			active:  null,
			tickets: [ ],

			snapToGrid:  SettingStore.get('snapToGrid'),
			showMinimap: SettingStore.get('showMinimap'),
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

		SettingStore.addChangeListener(function() {
			this.setState({
				snapToGrid:  SettingStore.get('snapToGrid'),
				showMinimap: SettingStore.get('showMinimap'),
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
