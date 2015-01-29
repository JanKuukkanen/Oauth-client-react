'use strict';

var _        = require('lodash');
var React    = require('react');
var UserType = require('../constants/enums').UserType;

var SideBar = React.createClass({
	propTypes: {

		/**
		 * The current user.
		 */
		user: React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
			type: React.PropTypes.oneOf(_.values(UserType)).isRequired,
		}),

		/**
		 * Width of the sidebar.
		 */
		width: React.PropTypes.number,
	},

	getDefaultProps: function() {
		return {
			user: {
				name: 'demouser',
				type: UserType.GUEST,
			},
			width: 80,
		}
	},

	render: function() {
		var style = {
			width: this.props.width,
		}

		// TODO Gravatar or something?
		var avatar = "http://www.placecage.com/c/128/128";

		return (
			<div className="sidebar" style={style}>
				<img className="sidebar-logo" src="dist/assets/logo.svg" />
				<div className="sidebar-avatar-wrapper">
					<img className="sidebar-avatar" src={avatar} />
				</div>
			</div>
		);
	}
});

module.exports = SideBar;
