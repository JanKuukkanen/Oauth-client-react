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
			<Modal onDismiss={this.props.onDismiss}>
				<ColorSelect color={this.linkState('color')} />
				<div className="dialog-content">
					{this.props.content}
				</div>
			</Modal>
		);
	}
});

module.exports = TicketEditDialog;
