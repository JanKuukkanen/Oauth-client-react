'use strict';

var _     = require('lodash');
var React = require('react');

var Modal         = require('./modal.jsx');
var TicketColor   = require('../constants/enums').TicketColor;
var TicketActions = require('../actions/ticket');

var TicketEditDialog = React.createClass({

	propTypes: {
		/**
		 *
		 */
		id: React.PropTypes.string.isRequired,

		/**
		 *
		 */
		color: React.PropTypes.oneOf(_.values(TicketColor)).isRequired,

		/**
		 *
		 */
		content: React.PropTypes.string.isRequired,

		/**
		 *
		 */
		onDismiss: React.PropTypes.func.isRequired,
	},

	render: function() {
		return (
			<Modal onDismiss={this.props.onDismiss}>
				Nice Modal
			</Modal>
		);
	}

});

module.exports = TicketEditDialog;
