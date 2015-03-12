'use strict';

var React  = require('react');
var Hammer = require('hammerjs');

var ErrorActions = require('../actions/error');

/**
 *
 */
var Alert = React.createClass({
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

module.exports = Alert;
