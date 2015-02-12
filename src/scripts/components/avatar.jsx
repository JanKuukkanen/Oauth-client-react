'use strict';

var React = require('react');

/**
 * Avatar component.
 */
var Avatar = React.createClass({
	propTypes: {
		/**
		 * The URL used as a 'src' attribute to the image.
		 */
		url: React.PropTypes.string.isRequired,

		/**
		 * Whether to add a '.lg' class to the component.
		 */
		large: React.PropTypes.bool,

		/**
		 * Add either a '.dark' or '.light' class to the component. Defaults to
		 * the '.dark' class.
		 */
		theme: React.PropTypes.oneOf(['dark', 'light']),

		/**
		 * Callback for clicking the avatar.
		 */
		onClick: React.PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			large:   false,
			theme:   'dark',
			onClick: function() {}
		}
	},

	render: function() {
		var classes = 'avatar' +
			(this.props.large ? ' lg ' : ' ') + this.props.theme;
		return (
			/* jshint ignore:start */
			<div className={classes}>
				<img src={this.props.url} onClick={this.props.onClick} />
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = Avatar;
