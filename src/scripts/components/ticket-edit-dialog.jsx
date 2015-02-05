'use strict';

var _     = require('lodash');
var React = require('react/addons');

var Modal         = require('./modal.jsx');
var ColorSelect   = require('./color-select.jsx');
var TicketColor   = require('../constants/enums').TicketColor;
var TicketActions = require('../actions/ticket');

var colors = _.values(TicketColor);

var TicketEditDialog = React.createClass({
	mixins: [React.addons.LinkedStateMixin],

	propTypes: {
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

		/**
		 *
		 */
		onDismiss: React.PropTypes.func.isRequired,
	},

	getInitialState: function() {
		return {
			color:   this.props.color,
			content: this.props.content,
		}
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<Modal onDismiss={this.props.onDismiss}>
				<div className="dialog">
					<div className="dialog-header">
						<ColorSelect color={this.linkState('color')} />
					</div>
					<div className="dialog-content">
						<textarea valueLink={this.linkState('content')} />
					</div>
					<div className="dialog-footer">
						<button className="btn turquoise dialog-submit"
								onClick={this._onSubmit}>
							Done
						</button>
						<button className="btn red dialog-cancel"
								onClick={this._onDelete}>
							Delete
						</button>
					</div>
				</div>
			</Modal>
			/* jshint ignore:end */
		);
	},

	/**
	 *
	 */
	_onSubmit: function() {
		TicketActions.editTicket({
			id:      this.props.id,
			color:   this.state.color,
			content: this.state.content,
		});
		return this.props.onDismiss();
	},

	/**
	 *
	 */
	_onDelete: function() {
		TicketActions.removeTicket({
			id: this.props.id,
		});
		return this.props.onDismiss();
	},
});

module.exports = TicketEditDialog;
