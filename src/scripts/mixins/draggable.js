'use strict';

var React     = require('react');
var Draggable = require('draggabilly');

/**
 * Makes the element draggable inside its parent container.
 */
module.exports = {

	getInitialState: function() {
		return {
			isDragging: false,
		}
	},

	componentDidMount: function() {
		this.draggable = new Draggable(this.getDOMNode(), {
			containment: true,
		});

		// Fix issue with IScroll and draggable elements, also isDragging...
		this.draggable.on('dragStart', function(draggable, ev) {
			this.setState({ isDragging: true });
			return ev.stopPropagation();
		}.bind(this));

		this.draggable.on('dragEnd', function() {
			this.setState({ isDragging: false });
		}.bind(this));
	},

	componentWillUnmount: function() {
		this.draggable.destroy()
		this.draggable = null;
	},
}
