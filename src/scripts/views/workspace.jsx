'use strict';

var React = require('react');

var Sidebar      = require('../components/sidebar.jsx');
var BoardPreview = require('../components/board-preview.jsx');

var AuthStore   = require('../stores/auth');
var DataStore   = require('../stores/data');
var DataActions = require('../actions/data');

var TICKET_WIDTH  = require('../constants').TICKET_WIDTH;
var TICKET_HEIGHT = require('../constants').TICKET_HEIGHT;

/**
 *
 */
function _upsize(board) {
	board.size.width  = board.size.width  * TICKET_WIDTH;
	board.size.height = board.size.height * TICKET_HEIGHT;
	return board;
}

/**
 *
 */
var Workspace = React.createClass({
	getInitialState: function() {
		return {
			user:   AuthStore.getUser(),
			boards: DataStore.getBoards().map(_upsize),
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
			boards: DataStore.getBoards().map(_upsize),
		});
	},

	render: function() {
		// TODO We need to make the workspace a 'Scrollable', because it seems
		//      to solve most of iOS problems on its own. However this is not
		//      really something that is very urgent.
		//
		//      Make the boards scrollable horizontally, similarly to the PS4
		//      Dashboard, could be good?
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

	/**
	 * TODO 	 */
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
