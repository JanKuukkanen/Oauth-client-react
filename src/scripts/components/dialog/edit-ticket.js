'use strict';

var React = require('react/addons');

var Dialog      = require('.');
var ColorSelect = require('../../components/color-select.jsx');

var Property      = require('../../constants/property');
var TicketActions = require('../../actions/ticket');

/**
 *
 */
var EditTicketDialog = React.createClass({
	mixins: [ React.addons.LinkedStateMixin ],

	propTypes: {
		ticket:    Property.Ticket.isRequired,
		boardID:   React.PropTypes.string.isRequired,
		onDismiss: React.PropTypes.func.isRequired,
	},

	getInitialState: function() {
		return {
			color:   this.props.ticket.color,
			content: this.props.ticket.content,
		}
	},

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

	_remove: function() {
		var boardID  = this.props.boardID;
		var ticketID = this.props.ticket.id;

		TicketActions.removeTicket(boardID, ticketID);
		return this.props.onDismiss();
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<Dialog className="edit-ticket-dialog" onDismiss={this.props.onDismiss}>
				<section className="dialog-header">
					<ColorSelect color={this.linkState('color')} />
				</section>
				<section className="dialog-content">
					<textarea valueLink={this.linkState('content')} />
				</section>
				<section className="dialog-footer">
					<button className="btn-danger" onClick={this._remove}>
						Delete
					</button>
					<button className="btn-primary" onClick={this._submit}>
						Done
					</button>
				</section>
			</Dialog>
			/* jshint ignore:end */
		);
	},
});

module.exports = EditTicketDialog;
