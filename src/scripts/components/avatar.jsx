'use strict';

var React = require('react/addons');

var Avatar = React.createClass({
	propTypes: {
		/**
		 *
		 */
		url: React.PropTypes.string.isRequired,

		/**
		 *
		 */
		onClick: React.PropTypes.func,

		/**
		 *
		 */
		large: React.PropTypes.bool,

		/**
		 *
		 */
		theme: React.PropTypes.oneOf(['dark', 'light']),
	},

	getDefaultProps: function() {
		return {
			large:   false,
			theme:   'dark',
			onClick: function() {}
		}
	},

	render: function() {
		var classes = React.addons.classSet({
			'lg':     this.props.large,
			'dark':   this.props.theme === 'dark',
			'light':  this.props.theme === 'light',
			'avatar': true,
		});

		return (
			<div className={classes}>
				<img src={this.props.url} onClick={this.props.onClick} />
			</div>
		);
	}
});

module.exports = Avatar;
