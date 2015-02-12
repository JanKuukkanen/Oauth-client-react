'use strict';

var React = require('react');

/**
 * Cursor is basically a box that can be resized using 'refs'.
 */
var Cursor = React.createClass({
	/**
	 * Resize the cursor. For 'IScroll' reasons we use the css properties
	 * directly instead of doing it the 'React' way...
	 *
	 * TODO Can we do this the 'React' way?
	 *
	 * @param {object} size         New size of the cursor.
	 * @param {number} size.width   New width of the cursor.
	 * @param {number} size.height  New height of the cursor.
	 */
	resize: function(size) {
		this.getDOMNode().style.width  = size.width;
		this.getDOMNode().style.height = size.height;
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className="cursor" />
			/* jshint ignore:end */
		);
	},
});

module.exports = Cursor;
