'use strict';

var React = require('react');

var Board = React.createClass({
	propTypes: {
		width:  React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
	},

	render: function() {
		var style = {
			width:  this.props.width,
			height: this.props.height,
		}

		return (
			<div className="scrollable-scroller" style={style}>
				{this.props.children}
			</div>
		);
	},
});

module.exports = Board;
