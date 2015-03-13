'use strict';

var React   = require('react');
var IScroll = require('iscroll');

var Minimap  = require('../components/minimap.jsx');
var Property = require('../constants/property');

/**
 * Component that is used to wrap another in order to make it scrollable using
 * the 'IScroll' library.
 */
var Scrollable = React.createClass({
	propTypes: {
		/**
		 * The size of the scrollable area. This is used to calculate the scale
		 * for various elements related to the 'Scrollable' component.
		 */
		size: Property.Size.isRequired,

		/**
		 * The markers displayed in the Minimap. Refer to the Minimap component
		 * for a more detailed property definition.
		 */
		markers: React.PropTypes.array,

		/**
		 * Whether to show or hide the Minimap.
		 */
		minimap: React.PropTypes.shape({
			show:       React.PropTypes.bool,
			background: React.PropTypes.string
		}),

		/**
		 * The element that will become the area that is scrollable.
		 */
		children: React.PropTypes.element.isRequired,
	},

	getDefaultProps: function() {
		return {
			minimap: {
				show:       false,
				background: null,
			},
			markers: [ ],
		}
	},

	getInitialState: function() {
		return {
			offset: { x: 0, y: 0 }
		}
	},

	componentDidMount: function() {
		// Attach 'IScroll' to this element. Note that we also attach a Minimap
		// in the form of 'indicators', with an interactive Cursor.
		this.scroller = new IScroll(this.getDOMNode(), {
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

		// Force the initial calculation of size for the 'cursor'.
		this._resizeMinimapCursor();

		// If we want to support IE8 and below, we have to use 'attachEvent'
		// instead of 'addEventListener', but let's not...
		window.addEventListener('resize', this._resizeMinimapCursor);

		// Keep track of the scroll position, which is transferred via 'props'
		// to the 'scrollable' element.
		this.scroller.on('scrollEnd', function() {
			this.setState({
				offset: { x: this.scroller.x, y: this.scroller.y }
			});
		}.bind(this));
	},

	componentWillUnmount: function() {
		window.removeEventListener('resize', this._resizeMinimapCursor);

		this.scroller.destroy();
		this.scroller = null;
	},

	componentDidUpdate: function(prev) {
		// If the 'minimap' is toggled to be shown, we need to recalculate it.
		// Note that this will 'refresh' the scrollable area, so we don't need
		// to calculate the refresh below.
		if(!prev.minimap.show && this.props.minimap.show) {
			return this._resizeMinimapCursor();
		}
		// If the size of the board changes, we need to refresh the scroller.
		var deltaWidth  = prev.size.width  - this.props.size.width;
		var deltaHeight = prev.size.height - this.props.size.height;
		if(deltaWidth !== 0 || deltaHeight !== 0) {
			return this._resizeMinimapCursor();
		}
	},

	/**
	 * Resizes the width and height for the 'cursor' element so that it matches
	 * the window size and orientation. Additionally invokes the 'refresh'
	 * method for the attached 'IScroll' instance.
	 */
	_resizeMinimapCursor: function() {
		if(this.props.minimap.show) {
			this.refs.minimap.resizeCursor({
				width:  this.getDOMNode().clientWidth,
				height: this.getDOMNode().clientHeight,
			});
			return this.scroller.refresh();
		}
	},

	render: function() {
		var props = {
			minimap: {
				size:       this.props.size,
				show:       this.props.minimap.show,
				markers:    this.props.markers,
				background: this.props.minimap.background,
			},
		}
		return (
			/* jshint ignore:start */
			<div className="scrollable">
				{this.renderScrollableElement()}
				<Minimap ref="minimap" {...props.minimap} />
			</div>
			/* jshint ignore:end */
		);
	},

	/**
	 * Renders the 'scrollable' element. The child is enhanced with an 'offset'
	 * property.
	 */
	renderScrollableElement: function() {
		return React.Children.map(this.props.children, function(child) {
			return React.addons.cloneWithProps(child, {
				offset: this.state.offset,
			});
		}.bind(this));
	},
});

module.exports = Scrollable;
