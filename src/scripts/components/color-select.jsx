'use strict';

var _     = require('lodash');
var React = require('react');

var TicketColor  = require('../constants/enums').TicketColor;
var ticketColors = _.values(TicketColor);

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

	render: function() {
		var selectedColor = {
			backgroundColor: this.props.color.value,
		}
		return (
			<div className="color-select">
				<div className="selected" style={selectedColor} />
				<div className="selector">
				{ticketColors.map(function(color) {
					var selectorColor = {
						backgroundColor: color,
					}
					return (
						<div key={color} className="color"
							style={selectorColor}
							onClick={this._selectColor.bind(null, color)} />
					);
				}.bind(this))}
				</div>
			</div>
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