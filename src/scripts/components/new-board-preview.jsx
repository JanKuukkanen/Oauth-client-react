'use strict';

var React  = require('react');
var Hammer = require('hammerjs');

var BoardActions = require('../actions/board');

/**
 * Similar to BoardPreview, allows adding a Board by clicking on it.
 */
var NewBoardPreview = React.createClass({
	componentDidMount: function() {
		this.hammer = new Hammer(this.refs.button.getDOMNode());
		this.hammer.on('tap', function() {
			return BoardActions.addBoard({
				// TODO We should maybe expose some 'controls', so that we can
				//      change some values before creating the board.
				size: { width: 10, height: 10 },
			});
		});
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className="new-board-preview">
				<div ref="button" className="minimap-container">
					Add Board
				</div>
				<div className="controls" />
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = NewBoardPreview;
