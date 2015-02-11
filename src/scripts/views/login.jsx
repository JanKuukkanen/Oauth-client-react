'use strict';

var page             = require('page');
var React            = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var Form        = require('../components/form.jsx');
var AuthActions = require('../actions/auth');

/**
 * View that displays a Login form.
 */
var LoginView = React.createClass({
	mixins: [LinkedStateMixin],

	getInitialState: function() {
		return {
			email:    '',
			password: '',
		}
	},

	_onLoginSubmit: function() {
		return AuthActions.login(this.state)
			.then(page.show.bind(null, '/boards'));
	},

	_showRegisterView: function() {
		return page.show('/register');
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className="application">
				<div className="view view-login">
					<Form title="Login" onSubmit={this._onLoginSubmit}>
						<input type="email"
							className="input"
							placeholder="Email"
							valueLink={this.linkState('email')} />
						<input type="password"
							className="input"
							placeholder="Password"
							valueLink={this.linkState('password')} />
					</Form>
					<div className="form-info">
						<p>Not registered?</p>
						<button className="btn violet fade"
								onClick={this._showRegisterView}>
							Register
						</button>
					</div>
				</div>
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = LoginView;
