'use strict';

var Immutable = require('immutable');

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

/**
 *
 */
var _boards = Immutable.List([]);

/**
 *
 */
var boardStoreAPI = {
	getBoard:  getBoard,
	getBoards: getBoards,
}

/**
 *
 */
module.exports = createStore(boardStoreAPI, function(action) {
	switch(action.type) {
		/**
		 *
		 */
		case Action.LOAD_BOARDS_SUCCESS:
			_boards = Immutable.List(action.payload);
			this.emitChange();
			break;

		/**
		 *
		 */
		case Action.ADD_BOARD:
			break;
		case Action.ADD_BOARD_SUCCESS:
			break;
		case Action.ADD_BOARD_FAILURE:
			break;

		/**
		 *
		 */
		case Action.EDIT_BOARD:
			break;
		case Action.EDIT_BOARD_FAILURE:
			break;

		/**
		 *
		 */
		case Action.REMOVE_BOARD:
			break;
		case Action.REMOVE_BOARD_FAILURE:
			break;
	}
});

/**
 *
 */
function getBoard(id) {
	return _boards.find(function(b) {
		return b.id === id;
	});
}

/**
 *
 */
function getBoards() {
	return _boards.toArray();
}
