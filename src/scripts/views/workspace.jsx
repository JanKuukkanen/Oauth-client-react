'use strict';

var React = require('react');

var Sidebar      = require('../components/sidebar.jsx');
var BoardPreview = require('../components/board-preview.jsx');

var AuthStore    = require('../stores/auth');
var BoardStore   = require('../stores/board');
var BoardActions = require('../actions/board');

var Workspace = React.createClass({
	getInitialState: function() {
		return {
			user:   AuthStore.getUser(),
			boards: BoardStore.getBoards(),
		}
	},

	componentDidMount: function() {
		AuthStore.addChangeListener(this._onAuthStoreChange);
		BoardStore.addChangeListener(this._onBoardStoreChange);

		return BoardActions.loadBoards();
	},

	componentWillUnmount: function() {
		AuthStore.removeChangeListener(this._onAuthStoreChange);
		BoardStore.removeChangeListener(this._onBoardStoreChange);
	},

	_onAuthStoreChange: function() {
		this.setState({
			user: AuthStore.getUser(),
		});
	},

	_onBoardStoreChange: function() {
		this.setState({
			boards: BoardStore.getBoards(),
		});
	},

	render: function() {
		// TODO We need to make the workspace a 'Scrollable', because it seems
		//      to solve most of iOS problems on its own. However this is not
		//      really something that is very urgent.
		return (
			/* jshint ignore:start */
			<div className="application">
				<Sidebar user={this.state.user} />
				<div className="view view-workspace">
					<div className="board-list">
						{this.renderBoards()}
					</div>
				</div>
			</div>
			/* jshint ignore:end */
		);
	},

	renderBoards: function() {
		return this.state.boards.map(function(board) {
			return (
				/* jshint ignore:start */
				<BoardPreview key={board.id} size={board.size}
					title={board.name} background={board.background} />
				/* jshint ignore:end */
			);
		});
	},
});

module.exports = Workspace;
