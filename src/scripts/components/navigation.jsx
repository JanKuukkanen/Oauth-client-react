'use strict';

var page  = require('page');
var React = require('react');

var listener    = require('../mixins/listener');
var Property    = require('../constants/property');
var AuthStore   = require('../stores/auth');
var AuthActions = require('../actions/auth');

var Dropdown = require('../components/dropdown.jsx');

/**
 *
 */
var items = [
	{ icon: 'user',     content: 'Profile',      disabled: true },
	{ icon: 'language', content: 'Localization', disabled: true },
	{
		onClick: function() {
			AuthActions.logout().then(page.show.bind(null, '/'));
		},
		icon: 'sign-out', content: 'Logout', disabled: false,
	}
];

/**
 *
 */
var Navigation = React.createClass({
	mixins: [ listener(AuthStore) ],

	propTypes: {
		title: React.PropTypes.string.isRequired,
	},

	getInitialState: function() {
		return {
			user:     AuthStore.getUser(),
			dropdown: false,
		}
	},

	onChange: function() {
		this.setState({ user: AuthStore.getUser() });
	},

	dropdown: function() {
		this.setState({ dropdown: !this.state.dropdown });
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<nav className="nav">
				<section className="title">
					<img src="/dist/assets/img/logo.svg" />
					<h1>{this.props.title}</h1>
				</section>
				<section className="profile">
					<div className="avatar" onClick={this.dropdown}>
						<span className="fa fa-fw fa-user"></span>
					</div>
					<Dropdown show={this.state.dropdown} items={items} />
				</section>
			</nav>
			/* jshint ignore:end */
		);
	}
});

module.exports = Navigation;
