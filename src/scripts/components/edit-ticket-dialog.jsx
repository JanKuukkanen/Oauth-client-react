'use strict';

var _                = require('lodash');
var React            = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var Dialog        = require('../components/dialog.jsx');
var ColorSelect   = require('../components/color-select.jsx');

var TicketActions = require('../actions/ticket');

var colors = _.values(require('../constants/enums').TicketColor);

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
			/**
			 *
			 */
			id: React.PropTypes.string.isRequired,

			/**
			 *
			 */
			color: React.PropTypes.oneOf(colors).isRequired,

			/**
			 *
			 */
			content: React.PropTypes.string.isRequired,
		}).isRequired,

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
		TicketActions.editTicket({
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
		TicketActions.removeTicket({
			id: this.props.ticket.id,
		});
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
