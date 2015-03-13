'use strict';

var React  = require('react');
var Hammer = require('hammerjs');

/**
 *
 */
var UserVoice = React.createClass({
	propTypes: {
		mode: React.PropTypes.string,
	},

	getDefaultProps: function() {
		return { mode: 'contact' }
	},

	componentWillMount: function() {
		if(!window.UserVoice) {
			var uvst   = document.createElement('script');
			uvst.src   = '//widget.uservoice.com/eXKxE4WzstJy0DTpmrepAA.js';
			uvst.async = true;
			return document.head.appendChild(uvst);
		}
	},

	componentDidMount: function() {
		new Hammer(this.getDOMNode()).on('tap', function() {
			window.UserVoice.push(['show', {
				mode:   this.props.mode,
				target: this.getDOMNode(),
			}]);
		}.bind(this));
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className="user-voice-trigger">
				{this.props.children}
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = UserVoice;
