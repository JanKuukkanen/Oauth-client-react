'use strict';

var React = require('react');

var Sidebar      = require('../components/sidebar.jsx');
var BoardPreview = require('../components/board-preview.jsx');

var AuthStore   = require('../stores/auth');
var DataStore   = require('../stores/data');
var DataActions = require('../actions/data');

var resize = require('../utils/resize');

/**
 * Displays the User's Boards.
 *
 * TODO Can the boards be scrollable similarly to PS4 Dashboard? In any case we
 *      should wrap the content into a Scrollable since it solves practically
 *      all the issues with different browsers.
 */
var Workspace = React.createClass({
	getInitialState: function() {
		return {
			user:   AuthStore.getUser(),
			boards: DataStore.getBoards().map(resize),
		}
	},

	componentDidMount: function() {
		AuthStore.addChangeListener(this._onAuthStoreChange);
		DataStore.addChangeListener(this._onDataStoreChange);

		return DataActions.loadBoards();
	},

	componentWillUnmount: function() {
		AuthStore.removeChangeListener(this._onAuthStoreChange);
		DataStore.removeChangeListener(this._onDataStoreChange);
	},

	_onAuthStoreChange: function() {
		this.setState({ user: AuthStore.getUser() });
	},

	_onDataStoreChange: function() {
		return this.setState({
			boards: DataStore.getBoards().map(resize),
		});
	},

	render: function() {
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
				<BoardPreview key={board.id} board={board} />
				/* jshint ignore:end */
			);
		});
	},
});

module.exports = Workspace;
