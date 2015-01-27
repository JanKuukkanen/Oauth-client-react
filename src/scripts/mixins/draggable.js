'use strict';

var React     = require('react');
var Draggable = require('draggabilly');

/**
 * Makes the element draggable inside its parent container.
 */
module.exports = {

	componentDidMount: function() {
		this.draggable = new Draggable(this.getDOMNode(), {
			containment: true,
		});

		// Fix issue with IScroll and draggable elements
		this.draggable.on('dragStart', function(draggable, ev) {
			return ev.stopPropagation();
		});
	},

	componentWillUnmount: function() {
		this.draggable.destroy()
		this.draggable = null;
	},
}
