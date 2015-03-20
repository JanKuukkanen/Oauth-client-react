'use strict';

var React  = require('react');
var Hammer = require('hammerjs');

var listener         = require('../mixins/listener');
var BroadcastStore   = require('../stores/broadcast');
var BroadcastActions = require('../actions/broadcast');

var BROADCAST_TIMEOUT = 5000;

/**
 *
 */
var BroadcastItem = React.createClass({
	propTypes: {
		broadcast: React.PropTypes.shape({
			type:    React.PropTypes.oneOf(['error', 'broadcast']).isRequired,
			content: React.PropTypes.string.isRequired,
		}).isRequired,
	},

	componentDidMount: function() {
		this.timeout = setTimeout(this.remove, BROADCAST_TIMEOUT);

		this.hammer = new Hammer(this.getDOMNode());
		this.hammer.on('tap', this.remove);
	},

	componentWillUnmount: function() {
		clearTimeout(this.timeout);
	},

	remove: function() {
		clearTimeout(this.timeout);
		BroadcastActions.see(this.props.broadcast);
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className={'item ' + this.props.broadcast.type + ''}>
				{this.props.broadcast.content}
			</div>
			/* jshint ignore:end */
		);
	}
});

/**
 *
 */
var Broadcast = React.createClass({
	mixins: [ listener(BroadcastStore) ],

	getState: function() {
		return {
			broadcasts: BroadcastStore.getBroadcasts(),
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
			<div className="broadcast-container">
				{this.renderBroadcasts()}
			</div>
			/* jshint ignore:end */
		);
	},

	renderBroadcasts: function() {
		return this.state.broadcasts.map(function(broadcast, index) {
			return (
				/* jshint ignore:start */
				<BroadcastItem key={index} broadcast={broadcast} />
				/* jshint ignore:end */
			);
		});
	}
});

module.exports = Broadcast;
