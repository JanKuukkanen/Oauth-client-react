'use strict';

var React = require('react');

var listener     = require('../mixins/listener');
var ErrorStore   = require('../stores/error');
var ErrorActions = require('../actions/error');

var Alert = require('../components/alert.jsx');

/**
 *
 */
var AlertBox = React.createClass({
	mixins: [ listener(ErrorStore) ],

	getState: function() {
		return {
			errors: ErrorStore.getUnseen(),
		}
	},

	getInitialState: function() {
		return this.getState();
	},

	onChange: function() {
		this.setState(this.getState());
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className="alert-box">
				{this.renderErrors()}
			</div>
			/* jshint ignore:end */
		);
	},

	renderErrors: function() {
		return this.state.errors.map(function(error, index) {
			return (
				/* jshint ignore:start */
				<Alert key={index} error={error} />
				/* jshint ignore:end */
			);
		});
	}
});

module.exports = AlertBox;
