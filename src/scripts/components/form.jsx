'use strict';

var React = require('react/addons');

var Logo = require('../components/logo.jsx');

/**
 * A submittable form, with a logo.
 */
var Form = React.createClass({
	propTypes: {
		logo:     React.PropTypes.bool,
		color:    React.PropTypes.oneOf(['violet', 'turquoise']),
		title:    React.PropTypes.string,
		onSubmit: React.PropTypes.func.isRequired,
	},

	getDefaultProps: function() {
		return {
			logo:  true,
			color: 'turquoise',
			title: '',
		}
	},

	render: function() {
		if(this.props.logo) {
			var logo = (
				/* jshint ignore:start */
				<Logo title="Contriboard" />
				/* jshint ignore:end */
			);
		}
		var btnClass = 'btn ' + this.props.color + '';

		return (
			/* jshint ignore:start */
			<div className="form">
				{logo}
				<div className="form-fields">
					{this.props.children}
				</div>
				<button className={btnClass} onClick={this.props.onSubmit}>
					{this.props.title}
				</button>
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = Form;
