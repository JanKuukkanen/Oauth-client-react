'use strict';

var React = require('react');

var Sidebar = require('../components/sidebar.jsx');

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
		return (
			<div className="application">
				<Sidebar user={this.state.user} />
				<div className="view view-workspace">
					{this.renderBoards()}
				</div>
			</div>
		);
	},

	renderBoards: function() {
		return this.state.boards.map(function(board) {
			var boardURL = '/boards/' + board.id + '';
			return (
				<div key={board.id} className="board-preview">
					<a href={boardURL}>{board.name}</a>
				</div>
			);
		});
	},
});

module.exports = Workspace;
