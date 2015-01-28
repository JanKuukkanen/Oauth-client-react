'use strict';

var React = require('react');

var Stripe = React.createClass({
	propTypes: {
		color: React.PropTypes.string.isRequired,
	},

	render: function() {
		var style = {
			width:      '100%',
			background: this.props.color,
		}

		return (
			<div className="stripe" style={style} />
		);
	}
});

module.exports = Stripe;