'use strict';

var _     = require('lodash');
var React = require('react');

var Dialog = require('../components/dialog.jsx');
var Avatar = require('../components/avatar.jsx');

var props       = require('../constants/props');
var UserType    = require('../constants/enums').UserType;
var UserTypes   = _.values(UserType);
var AuthActions = require('../actions/auth');

/**
 * Displays an overlaid Dialog to edit the given User.
 */
var EditUserDialog = React.createClass({
	propTypes: {
		/**
		 * Initial state for the User.
		 */
		user: props.User.isRequired,

		/**
		 * Callback for dialog dismissal.
		 */
		onDismiss: React.PropTypes.func.isRequired,
	},

	/**
	 * Triggers logging out the user. Note that we do not redirect the user to
	 * anywhere here, that is up to some other part of our application.
	 */
	_logout: function() {
		return AuthActions.logout();
	},

	render: function() {
		// TODO Gravatar or something? Needs to relate to the user..
		var avatar = 'http://www.placecage.com/c/128/128';

		return (
			/* jshint ignore:start */
			<Dialog className="edit-user-dialog"
					onDismiss={this.props.onDismiss}>
				<div />
				<div>
					<Avatar url={avatar} large={true} theme="light" />
					{this.props.user.name}
				</div>
				<div className="controls">
					<button className="btn turquoise"
							onClick={this.props.onDismiss}>
						Done
					</button>
					<button className="btn red"
							onClick={this._logout}>
						Logout
					</button>
				</div>
			</Dialog>
			/* jshint ignore:end */
		);
	}
});

module.exports = EditUserDialog;