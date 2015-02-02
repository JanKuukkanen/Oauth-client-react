'use strict';

var React            = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var RegisterView = React.createClass({
	mixins: [LinkedStateMixin],

	getInitialState: function() {
		return {
			email:    '',
			password: '',
		}
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

						<button className="btn violet">
							Register
						</button>

						<div className="separator" />

						<span className="info">
							Already registered?
						</span>

						<button className="btn turquoise fade">
							Sign In
						</button>

					</div>
				</div>
			</div>
		);
	}
});

module.exports = RegisterView;
