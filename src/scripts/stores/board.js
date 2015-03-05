'use strict';

var _         = require('lodash');
var Immutable = require('immutable');

var Action      = require('../constants/actions');
var Default     = require('../constants/defaults');
var createStore = require('../utils/create-store');

/**
 * Public API of the DataStore. Note that while the internal implementation is
 * immutable, the returned values are always regular arrays and objects.
 */
var BoardStoreAPI = {
	getBoard:   getBoard,
	getBoards:  getBoards,
}

/**
 * Represents the structure of data inside our application. The data is
 * structured using 'immutable' data structures.
 */
var _boards = Immutable.List([]);

/**
 * Get all the boards. Note that the returned boards do not contain 'tickets'.
 */
function getBoards() {
	return _boards.toJS();
}

/**
 * Get the board specified by the given 'boardID'. Note that the returned board
 * does not contain the 'tickets'.
 */
function getBoard(boardID) {
	var board = _boards.find(function(b) {
		return b.get('id') === boardID;
	});
	return board ? board.toJS() : null;
}

/**
 * Get the index of the model with given 'id' from the given collection.
 */
function _index(id, collection) {
	return collection.findIndex(function(m) {
		return m.get('id') === id;
	});
}

/**
 * Small helper to create an immutable version of a Board from plain JS.
 */
function _board(payload, defaults) {
	defaults = _.defaults(defaults || Default.BOARD, Default.BOARD);

	if(payload.accessCode === '') {
		// Quick hack so we can set the 'accessCode' to null... Not nice!
		defaults.accessCode = '';
	}

	return Immutable.Map({
		id:         payload.id         || defaults.id,
		name:       payload.name       || defaults.name,
		background: payload.background || defaults.background,
		accessCode: payload.accessCode || defaults.accessCode,

		size: Immutable.Map({
			width:  payload.size ? payload.size.width  : defaults.size.width,
			height: payload.size ? payload.size.height : defaults.size.height,
		}),
	});
}

/**
 * Adds a board to the given collection. If the board is already found the
 * collection, it is updated. Supports passing in an array of boards to add.
 */
function _addBoard(board, boards) {
	/**
	 * Adds a board to the given collection. If the board is already found the
	 * collection, it is updated.
	 */
	function _add(board, boards) {
		if(_index(board.id, boards) < 0) {
			return boards.push(_board(board));
		}
		return _editBoard(board.id, board, boards);
	}

	if(board instanceof Array) {
		if(board.length > 0) {
			// If an array of boards is passed in, we simply take one board at
			// a time and add it through recursion.
			return _addBoard(board, _add(board.pop(), boards));
		}
		return boards;
	}
	return _add(board, boards);
}

/**
 * Updates the specified board.
 */
function _editBoard(boardID, board, boards) {
	if(_index(boardID, boards) >= 0) {
		return boards.update(_index(boardID, boards), function(old) {
			return _board(board, old.toJS());
		});
	}
	return boards;
}

/**
 * Removes the specified board.
 */
function _removeBoard(boardID, boards) {
	if(_index(boardID, boards) >= 0) {
		return boards.remove(_index(boardID, boards));
	}
	return boards;
}

module.exports = createStore(BoardStoreAPI, function(action) {
	switch(action.type) {
		case Action.LOAD_BOARD_SUCCESS:
			_boards = _addBoard(action.payload.board, _boards);
			this.emitChange();
			break;

		case Action.LOAD_BOARDS_SUCCESS:
			_boards = _addBoard(action.payload.boards, _boards);
			this.emitChange();
			break;

		case Action.ADD_BOARD:
			_boards = _addBoard(action.payload.board, _boards);
			this.emitChange();
			break;
		case Action.ADD_BOARD_SUCCESS:
			_boards = _editBoard(
				action.payload.dirty,
				action.payload.clean,
				_boards
			);
			this.emitChange();
			break;
		case Action.ADD_BOARD_FAILURE:
			_boards = _removeBoard(action.payload.boardID, _boards);
			this.emitChange();
			break;

		case Action.EDIT_BOARD:
		case Action.EDIT_BOARD_FAILURE:
			_boards = _editBoard(
				action.payload.boardID,
				action.payload.board,
				_boards
			);
			this.emitChange();
			break;

		case Action.REMOVE_BOARD:
			_boards = _removeBoard(action.payload.boardID, _boards);
			this.emitChange();
			break;
		case Action.REMOVE_BOARD_FAILURE:
			_boards = _addBoard(action.payload.board, _boards);
			this.emitChange();
			break;

		case Action.REVOKE_ACCESS_CODE_FAILURE:
		case Action.GENERATE_ACCESS_CODE_SUCCESS:
			_boards = _editBoard(
				action.payload.boardID,
				{ accessCode: action.payload.accessCode },
				_boards
			);
			this.emitChange();
			break;

		case Action.REVOKE_ACCESS_CODE:
			_boards = _editBoard(
				action.payload.boardID, { accessCode: '' }, _boards
			);
			this.emitChange();
			break;

		case Action.LOGOUT_SUCCESS:
			_boards = Immutable.List([]);
			this.emitChange();
			break;
	}
});
