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
				name: 'unknown',
				type: 'unknown',
			},
		}
	},

	render: function() {
		// TODO Gravatar or something? Needs to relate to the user..
		var avatar = "http://www.placecage.com/c/128/128";

		return (
			<div className="sidebar">
				<img className="sidebar-logo" src="/dist/assets/img/logo.svg" />
				<div className="sidebar-avatar-wrapper">
					<img className="sidebar-avatar" src={avatar} />
				</div>
			</div>
		);
	}
});

module.exports = SideBar;
