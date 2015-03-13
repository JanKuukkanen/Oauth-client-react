'use strict';

var React = require('react');

var Broadcast    = require('../components/broadcast.jsx');
var Navigation   = require('../components/navigation.jsx');
var BoardPreview = require('../components/board-preview.jsx');
// var NewBoardPreview  = require('../components/new-board-preview.jsx');
// var UserVoiceTrigger = require('../components/user-voice-trigger.jsx');

var AuthStore    = require('../stores/auth');
var BoardStore   = require('../stores/board');
var BoardActions = require('../actions/board');

var resize   = require('../utils/resize');
var listener = require('../mixins/listener');

/**
 * Displays the User's Boards.
 *
 * TODO Can the boards be scrollable similarly to PS4 Dashboard? In any case we
 *      should wrap the content into a Scrollable since it solves practically
 *      all the issues with different browsers.
 */
var Workspace = React.createClass({
	mixins: [
		listener(BoardStore),
	],

	getState: function() {
		return {
			boards: BoardStore.getBoards().map(resize),
		}
	},

	getInitialState: function() {
		return this.getState();
	},

	onChange: function() {
		return this.setState(this.getState());
	},

	componentDidMount: function() {
		return BoardActions.loadBoards();
	},

	_addBoard: function() {
		return BoardActions.addBoard({});
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<div className="view view-workspace">
				<Broadcast />
				<Navigation title="Contriboard" />
				<div className="content">
					<div className="board-preview new-board" onClick={this._addBoard}>
						<span className="fa fa-fw fa-plus" />
					</div>
					{this.renderBoards()}
				</div>
			</div>
			/* jshint ignore:end */
		);
	},

	renderBoards: function() {
		return this.state.boards.map(function(board) {
			return (
				/* jshint ignore:start */
				<BoardPreview key={board.id} board={board} />
				/* jshint ignore:end */
			);
		});
	},
});

module.exports = Workspace;
