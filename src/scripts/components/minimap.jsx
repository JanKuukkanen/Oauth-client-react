'use strict';

var React = require('react/addons');

var props = require('../constants/props');

/**
 * Defines the maximum width or height of this component.
 */
var MAX_SIZE = 192;

/**
 * Component used with, but not limited to, 'IScroll'.
 */
var Minimap = React.createClass({
	propTypes: {
		/**
		 * Whether or not to show the minimap. Please note that setting this
		 * to false does not actually 'hide' the minimap, it just appends a
		 * '.hidden' css-class to the element, so it can be hidden easily.
		 */
		show: React.PropTypes.bool,

		/**
		 * Size of the area the minimap should display. Note that this is NOT
		 * the size of the minimap, it is instead used in calculating the size
		 * of the minimap while retaining the correct aspect ratio.
		 */
		area: props.Size,

		/**
		 * Markers displayed on the minimap. Leave empty for no markers.
		 */
		markers: React.PropTypes.arrayOf(React.PropTypes.shape({
			/**
			 * The real size of the marker. The relative size is calculated by
			 * the minimap.
			 */
			size: props.Size.isRequired,

			/**
			 * The color of the marker.
			 */
			color: React.PropTypes.string,

			/**
			 * The position of the marker. Note that this should be the reflect
			 * the real position of the object. Minimap will calculate the
			 * relative position based on it's size.
			 */
			position: props.Position.isRequired,
		})),

		/**
		 * The element, which should act as the 'cursor' for the minimap. This
		 * is mostly used by 'IScroll'.
		 */
		children: React.PropTypes.element,
	},

	getDefaultProps: function() {
		return {
			show: false,
			area: {
				width:  1,
				height: 1,
			},
			markers: [ ],
		}
	},

	render: function() {
		var classes = React.addons.classSet({
			'hidden':  !this.props.show,
			'minimap': true,
		});

		// Calculate the size of the minimap while retaining the aspect ratio
		// calculated from 'this.props.area' and clamping both the width and
		// the height to the maximum size defined by 'MAX_SIZE'.

		var area   = this.props.area;
		var width  = MAX_SIZE;
		var height = (area.height / area.width) * MAX_SIZE;
		var scale  = (height > MAX_SIZE) ? MAX_SIZE / height : 1.0;

		var style = {
			width:  scale * width,
			height: scale * height,
		}

		return (
			/* jshint ignore:start */
			<div className={classes} style={style}>
				{this.props.children}
				{this.renderMarkers(style.width / this.props.area.width)}
			</div>
			/* jshint ignore:end */
		);
	},

	/**
	 * Render the 'this.props.markers'.
	 *
	 * @param {number} scale  Defines the scaling factor for the marker's size
	 *                        and position, when placed on the minimap.
	 */
	renderMarkers: function(scale) {
		return this.props.markers.map(function(marker) {
			var style = {
				top:    Math.round(scale * marker.position.y),
				left:   Math.round(scale * marker.position.x),
				width:  Math.round(scale * marker.size.width),
				height: Math.round(scale * marker.size.height),

				zIndex:          marker.position.z,
				backgroundColor: marker.color,
			}
			return (
				/* jshint ignore:start */
				<div key={marker.key} className="marker" style={style} />
				/* jshint ignore:end */
			);
		});
	}
});

module.exports = Minimap;
