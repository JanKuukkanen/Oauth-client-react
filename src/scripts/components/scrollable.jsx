'use strict';

var React   = require('react/addons');
var IScroll = require('iscroll');

var Marker = require('./marker.jsx');

var TICKET_WIDTH  = require('../constants').TICKET_WIDTH;
var TICKET_HEIGHT = require('../constants').TICKET_HEIGHT;

var MINIMAP_MAX = require('../constants').MINIMAP_MAX;

/**
 * Scrollable is a wrapper element which makes the child element scrollable in
 * both X and Y dimensions.
 */
var Scrollable = React.createClass({

	propTypes: {
		/**
		 * The 'children' property must be a single child element, which will
		 * become the 'scroller' element.
		 */
		children: React.PropTypes.element.isRequired,

		/**
		 * The 'size' property determines the width and height of the element
		 * which Scrollable wraps.
		 */
		size: React.PropTypes.shape({
			width:  React.PropTypes.number,
			height: React.PropTypes.number,
		}).isRequired,

		/**
		 * The 'showMinimap' property indicates whether or not a minimap is
		 * shown.
		 */
		showMinimap: React.PropTypes.bool.isRequired,

		/**
		 * The 'markers' property indicates the markers displayed on the map.
		 */
		markers: React.PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			markers: [ ],
		}
	},

	getInitialState: function() {
		return {
			offset: {
				x: 0,
				y: 0,
			}
		}
	},

	componentDidMount: function() {
		this.scroller = new IScroll(this.refs.wrapper.getDOMNode(), {
			scrollX:    true,
			scrollY:    true,
			freeScroll: true,
			indicators: {
				el:          this.refs.minimap.getDOMNode(),
				shrink:      false,
				resize:      false,
				interactive: true,
			},
		});

		// Force the refresh when the component is first mounted
		this._resizeMinimapCursor();

		// If we want to support IE8 and below, we have to use 'attachEvent'
		// instead of 'addEventListener' so let's not...
		window.addEventListener('resize', this._resizeMinimapCursor);

		this.scroller.on('scrollEnd', function() {
			this.setState({
				offset: {
					x: this.scroller.x,
					y: this.scroller.y,
				}
			});
		}.bind(this));
	},

	componentWillUnmount: function() {
		this.scroller.destroy();
		this.scroller = null;
	},

	componentDidUpdate: function() {
		// When the 'minimap' is actually hidden, it does not have a size. So
		// when we set the minimap to show, we need to resize the cursor again.
		this._resizeMinimapCursor();
	},

	/**
	 * Resizes the width and height for the 'cursor' element so that it matches
	 * the window size and orientation.
	 */
	_resizeMinimapCursor: function() {
		var $cursor  = this.refs.cursor.getDOMNode();
		var $wrapper = this.refs.wrapper.getDOMNode();
		var $minimap = this.refs.minimap.getDOMNode();

		var scale = {
			x: $wrapper.clientWidth  / this.props.size.width,
			y: $wrapper.clientHeight / this.props.size.height,
		}

		$cursor.style.width  = Math.round(scale.x * $minimap.clientWidth);
		$cursor.style.height = Math.round(scale.y * $minimap.clientHeight);

		this.scroller.refresh();
	},

	render: function() {
		var minimapClasses = React.addons.classSet({
			'hidden':  !this.props.showMinimap,
			'minimap': true,
		});

		// Calculate the size of minimap, so that it reflects the size of the
		// scrollable area, e.g. it has the same aspect ratio.
		var size   = this.props.size;
		var height = (size.height / size.width) * MINIMAP_MAX;
		var width  = MINIMAP_MAX;

		// Clamp the width and height of the minimap so that they won't exceed
		// the max set in MINIMAP_MAX.
		var scale = (height > MINIMAP_MAX) ? MINIMAP_MAX / height : 1;

		var styles = {
			minimap: {
				width:  width  * scale,
				height: height * scale,
			},
		}

		return (
			<div className="scrollable">
				<div ref="wrapper" className="wrapper">
					{this.renderChildren()}
				</div>
				<div ref="minimap" className={minimapClasses}
						style={styles.minimap}>
					<div ref="cursor" className="cursor" />
					{this.renderMarkers(styles.minimap.width)}
				</div>
			</div>
		);
	},

	renderChildren: function() {
		return React.Children.map(this.props.children, function(child) {
			return React.addons.cloneWithProps(child, {
				offset: this.state.offset,
			});
		}.bind(this));
	},

	renderMarkers: function(minimapWidth) {
		// We need to calculate the correct size and position for the markers,
		// when minimap is basically resizable.
		var scale = minimapWidth / this.props.size.width;

		return this.props.markers.map(function(marker) {
			var style = {
				width:  Math.round(scale * TICKET_WIDTH),
				height: Math.round(scale * TICKET_HEIGHT),

				top:  Math.round(scale * marker.position.y),
				left: Math.round(scale * marker.position.x),

				zIndex: marker.position.z,

				backgroundColor: marker.color,
			}

			var size = {
				width: style.width,
				height: style.height,
			}

			var position = {
				x: style.left,
				y: style.top,
			}

			// return (
			// 	<Marker key={marker.id} color={marker.color}
			// 		size={size} position={position} />
			// );

			return (
				<div key={marker.id} className="marker" style={style} />
			);
		}.bind(this));
	},
});

module.exports = Scrollable;
