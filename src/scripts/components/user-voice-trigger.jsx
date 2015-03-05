'use strict';

var React  = require('react');
var Hammer = require('hammerjs');

/**
 *
 */
var UserVoiceTrigger = React.createClass({
	propTypes: {
		mode: React.PropTypes.string,
	},

	getDefaultProps: function() {
		return { mode: 'contact' }
	},

	componentWillMount: function() {
		if(!window.UserVoice) {
			var uvScriptTag       = document.createElement('script');
			    uvScriptTag.src   = '//widget.uservoice.com/eXKxE4WzstJy0DTpmrepAA.js';
			    uvScriptTag.async = true;
			return document.head.appendChild(uvScriptTag);
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
				UserVoiceTrigger
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = UserVoiceTrigger;
