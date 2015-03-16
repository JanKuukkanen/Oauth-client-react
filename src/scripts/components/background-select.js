'use strict';

var _     = require('lodash');
var React = require('react');

var Property   = require('../constants/property');
var Background = require('../constants/enums').Background;

/**
 *
 */
var BackgroundSelect = React.createClass({

	propTypes: {
		background: React.PropTypes.shape({
			value:         React.PropTypes.string.isRequired,
			requestChange: React.PropTypes.func.isRequired,
		}).isRequired,
	},

	onChange: function(ev) {
		this.props.background.requestChange(ev.target.value);
	},

	render: function() {
		/* jshint ignore:start */
		var bg      = Background[this.props.background.value];
		var preview = bg && bg.url ? <img src={bg.url} /> : <div className="blanko" />;
		/* jshint ignore:end */

		return (
			/* jshint ignore:start */
			<div className="background-select">
				<div className="value">
					{preview}
				</div>
				<label>Board Background</label>
				<div className="select">
					<select onChange={this.onChange} defaultValue={this.props.background.value}>
						{this.renderOptions()}
					</select>
					<span className="caret fa fa-arrow-down"></span>
				</div>
			</div>
			/* jshint ignore:end */
		);
	},

	renderOptions: function() {
		return _.keys(Background).map(function(bg) {
			return (
				/* jshint ignore:start */
				<option key={bg} value={bg}>
					{Background[bg].description}
				</option>
				/* jshint ignore:end */
			);
		});
	}
});

module.exports = BackgroundSelect;
