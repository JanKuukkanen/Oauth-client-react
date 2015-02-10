'use strict';

var _        = require('lodash');
var page     = require('page');
var React    = require('react');

var UserType  = require('../constants/enums').UserType;
var UserTypes = _.values(UserType);

var Logo           = require('../components/logo.jsx');
var Avatar         = require('../components/avatar.jsx');
var EditUserDialog = require('../components/edit-user-dialog.jsx');

var SideBar = React.createClass({
	propTypes: {
		/**
		 * The current user.
		 */
		user: React.PropTypes.shape({
			id:   React.PropTypes.string.isRequired,
			name: React.PropTypes.string.isRequired,
			type: React.PropTypes.oneOf(UserTypes).isRequired,
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

	getInitialState: function() {
		return {
			showDialog: false,
		}
	},

	/**
	 * Shows or hides the 'EditUserDialog'.
	 */
	_toggleDialog: function() {
		return this.setState({ showDialog: !this.state.showDialog });
	},

	render: function() {
		// TODO Gravatar or something? Needs to relate to the user..
		var avatar = 'http://www.placecage.com/c/128/128';

		if(this.props.user && this.state.showDialog) {
			var dialog = (
				/* jshint ignore:start */
				<EditUserDialog user={this.props.user}
					onDismiss={this._toggleDialog} />
				/* jshint ignore:end */
			);
		}
		return (
			/* jshint ignore:start */
			<div className="sidebar">
				<Logo   url="/boards" />
				<Avatar url={avatar} onClick={this._toggleDialog} />
				{dialog}
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = SideBar;
