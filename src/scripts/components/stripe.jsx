'use strict';

var React = require('react');

/**
 * Stripe is used to represent the color of a Ticket.
 */
var Stripe = React.createClass({
	propTypes: {
		/**
		 * Color of the 'stripe'.
		 */
		color: React.PropTypes.string.isRequired,
	},

	render: function() {
		var style = {
			background: this.props.color,
		}
		return (
			/* jshint ignore:start */
			<div className="stripe" style={style} />
			/* jshint ignore:end */
		);
	}
});

module.exports = Stripe;
