'use strict';

var React = require('react');
var Logo  = require('../components/logo.jsx');

/**
 * A submittable form. Optionally displays a logo.
 */
var Form = React.createClass({
	propTypes: {
		/**
		 * Whether to display the logo or not.
		 */
		logo: React.PropTypes.bool,

		/**
		 * The css-class appended to the Submit '.btn', effectively styling it
		 * with the given color.
		 */
		color: React.PropTypes.oneOf(['violet', 'turquoise']),

		/**
		 * Title of the form. Used as the content for the Submit button.
		 */
		title: React.PropTypes.string,

		/**
		 * Callback for clicking the Submit button.
		 */
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
