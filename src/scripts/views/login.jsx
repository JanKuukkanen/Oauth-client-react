'use strict';

var page             = require('page');
var React            = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var AuthActions = require('../actions/auth');

var Logo = require('../components/logo.jsx');

var LoginView = React.createClass({
	mixins: [LinkedStateMixin],

	getInitialState: function() {
		return {
			email:    '',
			password: '',
		}
	},

	/**
	 *
	 */
	_onLoginSubmit: function() {
		AuthActions.login({
			email:    this.state.email,
			password: this.state.password,
		})
			// When we have logged in, redirect to 'WorkSpace'.
			.then(page.show.bind(null, '/boards'));
	},

	/**
	 *
	 */
	_showRegisterView: function() {
		return page.show('/register');
	},

	render: function() {
		return (
			<div className="application">
				<div className="view view-login">
					<div className="form">

						<div className="title">
							<Logo />
							<div className="text">Contriboard</div>
						</div>

						<div className="form-title">
							Login
						</div>

						<div className="fields">
							<input type="email" className="input"
								placeholder="Email"
								valueLink={this.linkState('email')} />
							<input type="password" className="input"
								placeholder="Password"
								valueLink={this.linkState('password')} />
						</div>

						<button className="btn turquoise"
								onClick={this._onLoginSubmit}>
							Login
						</button>

						<div className="separator" />

						<span className="info">
							Not registered?
						</span>

						<button className="btn violet fade"
								onClick={this._showRegisterView}>
							Register
						</button>

					</div>
				</div>
			</div>
		);
	}
});

module.exports = LoginView;
