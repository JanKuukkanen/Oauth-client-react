'use strict';

var page             = require('page');
var React            = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var AuthActions = require('../actions/auth');

var RegisterView = React.createClass({
	mixins: [LinkedStateMixin],

	getInitialState: function() {
		return {
			email:    '',
			password: '',
		}
	},

	_onRegisterSubmit: function() {
		AuthActions.register({
			email:    this.state.email,
			password: this.state.password,
		})
			// Once the user has 'registered', redirect to 'LoginView'.
			.then(page.show.bind(null, '/login'));
	},

	_showLoginView: function() {
		return page.show('/login');
	},

	render: function() {
		return (
			<div className="application">
				<div className="view view-register">
					<div className="form">

						<div className="logo">
							<img src="/dist/assets/img/logo.svg" />
							<span className="title">Contriboard</span>
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
		);
	}
});

module.exports = RegisterView;
