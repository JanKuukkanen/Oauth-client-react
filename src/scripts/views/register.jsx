'use strict';

var page             = require('page');
var React            = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var Logo = require('../components/logo.jsx');

var AuthActions = require('../actions/auth');

/**
 * View that displays a Register form.
 *
 * TODO Refactor into smaller components, similarly to LoginView.
 */
var RegisterView = React.createClass({
	mixins: [LinkedStateMixin],

	getInitialState: function() {
		return {
			email:    '',
			password: '',
		}
	},

	_onRegisterSubmit: function() {
		return AuthActions.register(this.state)
			.then(page.show.bind(null, '/login'));
	},

	_showLoginView: function() {
		return page.show('/login');
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className="application">
				<div className="view view-register">
					<div className="form">

						<div className="title">
							<Logo />
							<div className="text">Contriboard</div>
						</div>

						<div className="form-title">
							Register
						</div>

						<div className="fields">
							<input type="email" className="input"
								placeholder="Email"
								valueLink={this.linkState('email')} />
							<input type="password" className="input"
								placeholder="Password"
								valueLink={this.linkState('password')} />
						</div>

						<button className="btn violet"
								onClick={this._onRegisterSubmit}>
							Register
						</button>

						<div className="separator" />

						<span className="info">
							Already registered?
						</span>

						<button className="btn turquoise fade"
								onClick={this._showLoginView}>
							Sign In
						</button>

					</div>
				</div>
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = RegisterView;
