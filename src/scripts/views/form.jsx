'use strict';

var page  = require('page');
var React = require('react/addons');

var ErrorBox = require('../components/broadcast.jsx');

/**
 *
 */
var FormView = React.createClass({
	mixins: [React.addons.LinkedStateMixin],

	propTypes: {
		fields: React.PropTypes.arrayOf(React.PropTypes.shape({
			type: React.PropTypes.oneOf([
				'text', 'email', 'password'
			]).isRequired,
			name:  React.PropTypes.string.isRequired,
			label: React.PropTypes.string.isRequired
		})),
		secondary: React.PropTypes.shape({
			submit:      React.PropTypes.func.isRequired,
			action:      React.PropTypes.string.isRequired,
			description: React.PropTypes.string,
		}),
		help:   React.PropTypes.string,
		submit: React.PropTypes.func.isRequired,
		action: React.PropTypes.string.isRequired,
	},

	getDefaultProps: function() {
		return {
			fields:    [],
			secondary: null,
		}
	},

	getInitialState: function() {
		return this.props.fields.reduce(function(state, field) {
			state[field.name] = ''; return state;
		}, {});
	},

	/**
	 *
	 */
	_submit: function() {
		return this.props.submit(this.state);
	},

	render: function() {
		var secondaryContent = !this.props.secondary ? null : (
			/* jshint ignore:start */
			<section className="secondary">
				<p>{this.props.secondary.description}</p>
				<button className="btn-secondary"
						onClick={this.props.secondary.submit}>
					{this.props.secondary.action}
				</button>
			</section>
			/* jshint ignore:end */
		);
		return (
			/* jshint ignore:start */
			<div className="view view-form">
				<ErrorBox />
				<div className="view-content">
					<div className="form">
						<div className="logo">
							<img src="/dist/assets/img/logo.svg" />
							<h1>Contriboard</h1>
						</div>
						{this.renderFields(this.props.fields)}
						<button className="btn-primary" onClick={this._submit}>
							{this.props.action}
						</button>
						<article className="help">{this.props.help}</article>
						<section className="secondary-content">
							{secondaryContent}
						</section>
					</div>
				</div>
			</div>
			/* jshint ignore:end */
		);
	},

	renderFields: function(fields) {
		return fields.map(function(field) {
			return (
				/* jshint ignore:start */
				<section key={field.name} className="input">
					<label htmlFor={field.name}>
						{field.label}
					</label>
					<input name={field.name} type={field.type}
						valueLink={this.linkState(field.name)} />
				</section>
				/* jshint ignore:end */
			);
		}.bind(this));
	}
});

module.exports = FormView;
