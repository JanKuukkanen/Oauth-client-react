'use strict';

var _                = require('lodash');
var React            = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var Dialog      = require('.');
var ColorSelect = require('../../components/color-select.jsx');

var Property      = require('../../constants/property');
var TicketColors  = _.values(require('../../constants/enums').TicketColor);
var TicketActions = require('../../actions/ticket');

/**
 * Displays an overlaid Dialog to edit the given Ticket.
 */
var EditTicketDialog = React.createClass({
	mixins: [React.addons.LinkedStateMixin],

	propTypes: {
		/**
		 * Initial state for the ticket.
		 */
		ticket: Property.Ticket.isRequired,

		/**
		 * Since tickets are stored relative to the board they are in, we need
		 * to know on what board the ticket is in.
		 */
		boardID: React.PropTypes.string.isRequired,

		/**
		 * Callback for dialog dismissal.
		 */
		onDismiss: React.PropTypes.func.isRequired,
	},

	getInitialState: function() {
		return {
			color:   this.props.ticket.color,
			content: this.props.ticket.content,
		}
	},

	/**
	 * Triggers persisting the edits.
	 */
	_submit: function() {
		var boardID  = this.props.boardID;
		var ticketID = this.props.ticket.id;

		TicketActions.editTicket(boardID, ticketID, {
			id:      this.props.ticket.id,
			color:   this.state.color,
			content: this.state.content,
		});
		return this.props.onDismiss();
	},

	/**
	 * Triggers removal of the Ticket.
	 */
	_remove: function() {
		var boardID  = this.props.boardID;
		var ticketID = this.props.ticket.id;

		TicketActions.removeTicket(boardID, ticketID);
		return this.props.onDismiss();
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<Dialog className="edit-ticket-dialog"
					onDismiss={this.props.onDismiss}>
				<ColorSelect color={this.linkState('color')} />
				<div className="form">
					<textarea valueLink={this.linkState('content')} />
				</div>
				<div className="controls">
					<button className="btn turquoise" onClick={this._submit}>
						Done
					</button>
					<button className="btn red" onClick={this._remove}>
						Delete
					</button>
				</div>
			</Dialog>
			/* jshint ignore:end */
		);
	},
});

module.exports = EditTicketDialog;
