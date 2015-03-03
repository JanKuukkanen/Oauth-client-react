'use strict';

var page  = require('page');
var React = require('react/addons');

var AuthActions = require('../actions/auth');

var Form     = require('../components/form.jsx');
var AlertBox = require('../components/alert-box.jsx');

/**
 * View that displays a Register form.
 */
var RegisterView = React.createClass({
	mixins: [React.addons.LinkedStateMixin],

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
				<AlertBox />
				<div className="view view-login">
					<Form title="Register" color="violet"
							onSubmit={this._onRegisterSubmit}>
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
						<p>Already registered?</p>
						<button className="btn turquoise fade"
								onClick={this._showLoginView}>
							Login
						</button>
					</div>
				</div>
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = RegisterView;
