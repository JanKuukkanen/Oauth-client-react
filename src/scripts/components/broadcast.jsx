'use strict';

var React  = require('react');
var Hammer = require('hammerjs');

var listener     = require('../mixins/listener');
var ErrorStore   = require('../stores/error');
var ErrorActions = require('../actions/error');

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
		this.hammer = new Hammer(this.getDOMNode());

		this.hammer.on('tap', function() {
			return ErrorActions.markAsSeen(this.props.error);
		}.bind(this));
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className="item error">
				{
					'[' + this.props.error.statusCode + ']' +
					' ' + this.props.error.type + ''
				}
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
