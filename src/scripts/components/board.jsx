'use strict';

var React = require('react');

var Board = React.createClass({
	propTypes: {
		size: React.PropTypes.shape({
			width:  React.PropTypes.number,
			height: React.PropTypes.number,
		}).isRequired,
	},

	render: function() {
		return (
			<div className="board" style={this.props.size}>
				{this.props.children}
			</div>
		);
	},
});

module.exports = Board;
