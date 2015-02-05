'use strict';

var React = require('react');

var Stripe = React.createClass({
	propTypes: {
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