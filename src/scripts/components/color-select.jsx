'use strict';

var _      = require('lodash');
var React  = require('react');
var Hammer = require('hammerjs');

var TicketColors = _.values(require('../constants/enums').TicketColor);

/**
 * Small button representing a single color.
 */
var ColorButton = React.createClass({
	propTypes: {
		/**
		 * Color of the button.
		 */
		color: React.PropTypes.oneOf(TicketColors).isRequired,

		/**
		 * Callback for when this color is selected or clicked or whatever.
		 */
		onSelect: React.PropTypes.func.isRequired,
	},

	componentDidMount: function() {
		this.hammer = new Hammer(this.getDOMNode());
		this.hammer.on('tap', function() {
			return this.props.onSelect(this.props.color);
		}.bind(this));
	},

	render: function() {
		var style = {
			backgroundColor: this.props.color,
		}
		return (
			/* jshint ignore:start */
			<div className="option" style={style} />
			/* jshint ignore:end */
		);
	},
});

/**
 * Selector component for color values.
 */
var ColorSelect = React.createClass({
	propTypes: {
		/**
		 * The 'color' property is a 'ValueLink', which indicates the currently
		 * selected color.
		 */
		color: React.PropTypes.shape({
			value:         React.PropTypes.oneOf(TicketColors).isRequired,
			requestChange: React.PropTypes.func.isRequired,
		}).isRequired,
	},

	/**
	 * Uses the 'this.props.color' ValueLink to update the given color.
	 */
	_selectColor: function(newColor) {
		this.props.color.requestChange(newColor);
	},

	render: function() {
		var selectedColor = {
			backgroundColor: this.props.color.value,
		}
		return (
			/* jshint ignore:start */
			<div className="color-select">
				<div className="value" style={selectedColor} />
				<div className="options">
				{TicketColors.map(function(color) {
					return (
						<ColorButton key={color} color={color}
							onSelect={this._selectColor} />
					);
				}.bind(this))}
				</div>
			</div>
			/* jshint ignore:end */
		);
	},
});

module.exports = ColorSelect;