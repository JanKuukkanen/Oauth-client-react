'use strict';

var React   = require('react');
var IScroll = require('iscroll');

var Cursor  = require('../components/cursor.jsx');
var Minimap = require('../components/minimap.jsx');

var props = require('../constants/props');

/**
 * Component that is used to wrap another in order to make it scrollable using
 * the 'IScroll' library.
 */
var Scrollable = React.createClass({
	propTypes: {
		/**
		 * The element that will become the area that is scrollable.
		 */
		children: React.PropTypes.element.isRequired,

		/**
		 * The size of the scrollable area. This is used to calculate the scale
		 * for various elements related to the 'Scrollable' component.
		 */
		size: props.Size.isRequired,

		/**
		 * Whether to show or hide the Minimap.
		 */
		minimap: React.PropTypes.bool,

		/**
		 * The markers displayed in the Minimap. Refer to the Minimap component
		 * for a more detailed property definition.
		 */
		markers: React.PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			minimap: false,
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
		if(this.props.minimap) {
			return this._resizeMinimapCursor();
		}
		// If the size of the board changes, we need to refresh the scroller.
		var deltaWidth  = prev.size.width  - this.props.size.width;
		var deltaHeight = prev.size.height - this.props.size.height;
		if(deltaWidth !== 0 || deltaHeight !== 0) {
			this.scroller.refresh();
		}
	},

	/**
	 * Resizes the width and height for the 'cursor' element so that it matches
	 * the window size and orientation. Additionally invokes the 'refresh'
	 * method for the attached 'IScroll' instance.
	 */
	_resizeMinimapCursor: function() {
		if(!this.props.minimap) return;

		var $wrapper = this.refs.wrapper.getDOMNode();
		var $minimap = this.refs.minimap.getDOMNode();

		var scale = {
			x: $wrapper.clientWidth  / this.props.size.width,
			y: $wrapper.clientHeight / this.props.size.height,
		}
		var size = {
			width:  Math.round(scale.x * $minimap.clientWidth),
			height: Math.round(scale.y * $minimap.clientHeight),
		}

		this.refs.cursor.resize(size);
		this.scroller.refresh();
	},

	render: function() {
		var props = {
			minimap: {
				ref:     'minimap',
				area:    this.props.size,
				show:    this.props.minimap,
				markers: this.props.markers,
			},
		}
		return (
			/* jshint ignore:start */
			<div className="scrollable">
				<div ref="wrapper" className="wrapper">
					{this.renderScrollable()}
				</div>
				<Minimap {...props.minimap}>
					<Cursor ref="cursor" />
				</Minimap>
			</div>
			/* jshint ignore:end */
		);
	},

	/**
	 * Renders the 'scrollable' element. The child is enhanced with an 'offset'
	 * property.
	 */
	renderScrollable: function() {
		return React.Children.map(this.props.children, function(child) {
			return React.addons.cloneWithProps(child, {
				offset: this.state.offset,
			});
		}.bind(this));
	},
});

module.exports = Scrollable;
