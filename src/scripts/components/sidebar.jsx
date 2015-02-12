'use strict';

var _        = require('lodash');
var page     = require('page');
var React    = require('react');

var Logo           = require('../components/logo.jsx');
var Avatar         = require('../components/avatar.jsx');
var EditUserDialog = require('../components/edit-user-dialog.jsx');

var props = require('../constants/props');

/**
 * Sidebar with some navigation and user controls.
 */
var SideBar = React.createClass({
	propTypes: {
		/**
		 * The initial state of the User.
		 */
		user: props.User.isRequired,
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
