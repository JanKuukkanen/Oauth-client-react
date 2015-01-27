'use strict';

var React = require('react/addons');

var Board      = require('../components/board.jsx');
var SideBar    = require('../components/side-bar.jsx');
var Scrollable = require('../components/scrollable.jsx');

/**
 *
 */
var BoardView = React.createClass({
	mixins: [
		React.addons.LinkedStateMixin
	],

	getInitialState: function() {
		return {
			width:  1920,
			height: 1080,

			position: {
				x: 0,
				y: 0,
			},
		}
	},

	componentDidMount: function() {
		// BoardActions.loadBoard(board_id)
		// TicketActions.loadTickets(board_id)
	},

	render: function() {
		return (
			<div className="board-view">
				<SideBar />
				<Scrollable position={this.linkState('position')}>
					<Board width={this.state.width} height={this.state.height}>

					</Board>
				</Scrollable>
			</div>
		);
	}
});

module.exports = BoardView;
