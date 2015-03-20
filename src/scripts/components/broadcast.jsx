'use strict';

var React  = require('react');
var Hammer = require('hammerjs');

var listener     = require('../mixins/listener');
var ErrorStore   = require('../stores/error');
var ErrorActions = require('../actions/error');

var ERROR_TIMEOUT = 5000;

/**
 *
 */
var ErrorItem = React.createClass({
	propTypes: {
		error: function(props) {
			if(!(props.error instanceof Error)) {
				return new Error('Must be instanceof Error!');
			}
		}
	},

	componentDidMount: function() {
		this.timeout = setTimeout(this.remove, ERROR_TIMEOUT);

		this.hammer = new Hammer(this.getDOMNode());
		this.hammer.on('tap', this.remove);
	},

	componentWillUnmount: function() {
		clearTimeout(this.timeout);
	},

	remove: function() {
		clearTimeout(this.timeout);
		ErrorActions.markAsSeen(this.props.error);
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className="item error">
				{this.props.error.description}
			</div>
			/* jshint ignore:end */
		);
	}
});

/**
 *
 */
var Broadcast = React.createClass({
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
		return this.setState(this.getState());
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className="broadcast">
				{this.renderErrors()}
			</div>
			/* jshint ignore:end */
		);
	},

	renderErrors: function() {
		return this.state.errors.map(function(error, index) {
			return (
				/* jshint ignore:start */
				<ErrorItem key={index} error={error} />
				/* jshint ignore:end */
			);
		});
	}
});

module.exports = Broadcast;
