'use strict';

var React   = require('react/addons');
var IScroll = require('iscroll');

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
		 * The 'position' property is a React ValueLink, which is used to
		 * determine the position of the 'scroller' element. Because we are
		 * using a ValueLink here, we can modify the scroller's state from the
		 * outside.
		 */
		position: React.PropTypes.shape({
			value: React.PropTypes.shape({
				x: React.PropTypes.number,
				y: React.PropTypes.number,
			}),
			requestChange: React.PropTypes.func,
		}),
	},

	getDefaultProps: function() {
		// NOTE Since we have no use for ValueLink right now, we actually
		//      manage the scroller's state internally for now.
		//
		//      Consider this WIP not final at all.
		var position = { x: 0, y: 0 }

		return {
			position: {
				value: position,
				requestChange: function(pos) {
					position.x = pos.x;
					position.y = pos.y;
				}
			}
		}
	},

	componentDidMount: function() {
		// Attach a new IScroll instance to the component's DOM node. Note that
		// IScroll uses negative values to indicate offset from the origin.
		this.scroller = new IScroll(this.getDOMNode(), {
			startX:     (-1) * this.props.position.value.x,
			startY:     (-1) * this.props.position.value.y,
			scrollX:    true,
			scrollY:    true,
			freeScroll: true,
		});

		this.scroller.on('scrollEnd', function() {
			this.props.position.requestChange({
				x: (-1) * this.scroller.x,
				y: (-1) * this.scroller.y,
			});
		}.bind(this));
	},

	componentWillReceiveProps: function(next) {
		var nextX = (-1) * next.position.value.x;
		var nextY = (-1) * next.position.value.y;

		// Scroll to the new position if there is going to be a change in it
		if(nextX !== this.scroller.x || nextY !== this.scroller.y) {
			this.scroller.scrollTo(nextX, nextY, 500);
		}
	},

	componentWillUnmount: function() {
		this.scroller.destroy();
		this.scroller = null;
	},

	render: function() {
		var style = {
			height:   '100%',
			overflow: 'hidden',
			position: 'relative',
		}
		return (
			<div className="scrollable-wrapper" style={style}>
				{this.props.children}
			</div>
		);
	},
});

module.exports = Scrollable;
