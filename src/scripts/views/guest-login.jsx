'use strict';

var page             = require('page');
var React            = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var Form        = require('../components/form.jsx');
var AuthActions = require('../actions/auth');

/**
 * View that displays a GuestLogin form.
 */
var GuestLoginView = React.createClass({
	mixins: [LinkedStateMixin],

	propTypes: {
		/**
		 * The 'id' of the board we want to login as a guest to...
		 */
		boardID: React.PropTypes.string.isRequired,

		/**
		 * The 'accessCode' of the board we want to login as a guest to...
		 */
		accessCode: React.PropTypes.string.isRequired,
	},

	getInitialState: function() {
		return {
			username: '',
		}
	},

	_onGuestLoginSubmit: function() {
		return console.log({
			boardID:    this.props.boardID,
			username:   this.state.username,
			accessCode: this.props.accessCode,
		});
		// return AuthActions.guestLogin(this.state)
		// 	.then(page.show.bind(null, '/boards'));
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className="application">
				<div className="view view-guest-login">
					<Form title="Login as Guest"
							onSubmit={this._onGuestLoginSubmit}>
						<input type="text"
							className="input"
							placeholder="Username"
							valueLink={this.linkState('username')} />
					</Form>
				</div>
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = GuestLoginView;
