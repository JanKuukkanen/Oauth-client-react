'use strict';

var _      = require('lodash');
var React  = require('react');
var Hammer = require('hammerjs');

var TicketColor  = require('../constants/enums').TicketColor;
var ticketColors = _.values(TicketColor);

var ColorButton = React.createClass({
	propTypes: {
		color:    React.PropTypes.oneOf(ticketColors).isRequired,
		onSelect: React.PropTypes.func.isRequired,
	},

	componentDidMount: function() {
		this.hammer = new Hammer(this.getDOMNode());
		this.hammer.on('tap', function onTap() {
			this.props.onSelect(this.props.color);
		}.bind(this));
	},

	render: function() {
		var style = {
			backgroundColor: this.props.color,
		}
		return (
			/* jshint ignore:start */
			<div className="color-button" style={style} />
			/* jshint ignore:end */
		);
	},
});

var ColorSelect = React.createClass({

	propTypes: {
		/**
		 *
		 */
		color: React.PropTypes.shape({
			value:         React.PropTypes.oneOf(ticketColors).isRequired,
			requestChange: React.PropTypes.func.isRequired,
		}).isRequired,
	},

	componentDidMount: function() {
		new Hammer(this.refs.selector.getDOMNode());
	},

	render: function() {
		var selectedColor = {
			backgroundColor: this.props.color.value,
		}
		return (
			/* jshint ignore:start */
			<div className="color-select">
				<div className="selected" style={selectedColor} />
				<div ref="selector" className="selector">
				{ticketColors.map(function(color) {
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

	/**
	 *
	 */
	_selectColor: function(newColor) {
		this.props.color.requestChange(newColor);
	},

});

module.exports = ColorSelect;