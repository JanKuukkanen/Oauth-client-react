'use strict';

var _                = require('lodash');
var React            = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var Dialog      = require('../components/dialog.jsx');
var ColorSelect = require('../components/color-select.jsx');

var DataActions  = require('../actions/data');
var TicketColors = _.values(require('../constants/enums').TicketColor);

/**
 *
 */
var EditTicketDialog = React.createClass({
	mixins: [React.addons.LinkedStateMixin],

	propTypes: {
		/**
		 *
		 */
		ticket: React.PropTypes.shape({
			id:      React.PropTypes.string.isRequired,
			color:   React.PropTypes.oneOf(TicketColors).isRequired,
			content: React.PropTypes.string.isRequired,
		}).isRequired,

		/**
		 *
		 */
		boardID: React.PropTypes.string.isRequired,

		/**
		 *
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
	 *
	 */
	_submit: function() {
		var boardID  = this.props.boardID;
		var ticketID = this.props.ticket.id;

		DataActions.editTicket(boardID, ticketID, {
			id:      this.props.ticket.id,
			color:   this.state.color,
			content: this.state.content,
		});
		return this.props.onDismiss();
	},

	/**
	 *
	 */
	_remove: function() {
		var boardID  = this.props.boardID;
		var ticketID = this.props.ticket.id;

		DataActions.removeTicket(boardID, ticketID);
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
