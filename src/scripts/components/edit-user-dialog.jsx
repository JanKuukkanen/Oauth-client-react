'use strict';

var _     = require('lodash');
var React = require('react');

var UserType  = require('../constants/enums').UserType;
var UserTypes = _.values(UserType);

var AuthActions = require('../actions/auth');

var Dialog = require('../components/dialog.jsx');
var Avatar = require('../components/avatar.jsx');

var EditUserDialog = React.createClass({
	propTypes: {
		/**
		 *
		 */
		user: React.PropTypes.shape({
			id:   React.PropTypes.string.isRequired,
			name: React.PropTypes.string.isRequired,
			type: React.PropTypes.oneOf(UserTypes).isRequired,
		}).isRequired,

		/**
		 *
		 */
		onDismiss: React.PropTypes.func.isRequired,
	},

	/**
	 *
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