'use strict';

var _ = require('lodash');

var uid        = require('../utils/uid');
var api        = require('../utils/api');
var build      = require('../utils/action-builder');
var Action     = require('../constants/actions');
var Dispatcher = require('../dispatcher');

var AuthStore  = require('../stores/auth');
var BoardStore = require('../stores/board');

/**
 * The methods exported by BoardActions
 */
module.exports = {
	addBoard:    addBoard,
	editBoard:   editBoard,
	loadBoards:  loadBoards,
	removeBoard: removeBoard,
}

/**
 *
 */
function loadBoards() {
	var opts = {
		token: AuthStore.getToken(),
	}
	var initial = {
		type: Action.LOAD_BOARDS,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess(boards) {
		return { boards: boards }
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return { error: err }
	}

	return build(initial, api.getBoards(opts).then(onSuccess, onFailure));
}

/**
 *
 * TODO Make the ID generation into its own utility function.
 */
function addBoard(board) {
	var opts = {
		token:   AuthStore.getToken(),
		payload: board,
	}
	var initial = {
		payload: {
			// We generate a 'mock' id for the board, so we can be optimistic.
			board: _.assign(board, { id: uid() }),
		},
		type: Action.ADD_BOARD,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess(board) {
		return {
			cleanID: board.id,
			dirtyID: initial.payload.board.id,
		}
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return {
			error:   err,
			boardID: initial.payload.board.id,
		}
	}

	return build(initial, api.createBoard(opts).then(onSuccess, onFailure));
}

/**
 *
 */
function editBoard(boardID, board) {
	// This way we can undo changes if something goes wrong...
	var old = BoardStore.getBoard(boardID);

	var opts = {
		id: {
			board: boardID,
		},
		token:   AuthStore.getToken(),
		payload: board,
	}
	var initial = {
		payload: {
			board:   board,
			boardID: boardID,
		},
		type: Action.EDIT_BOARD,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess(board) {
		return { board: board, boardID: boardID }
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return {
			error:   err,
			board:   old,
			boardID: boardID,
		}
	}

	return build(initial, api.updateBoard(opts).then(onSuccess, onFailure));
}

/**
 *
 */
function removeBoard(boardID) {
	// This way we can undo changes if something goes wrong...
	var old = BoardStore.getBoard(boardID);

	var opts = {
		id: {
			board: boardID,
		},
		token: AuthStore.getToken(),
	}
	var initial = {
		payload: {
			boardID: boardID,
		},
		type: Action.REMOVE_BOARD,
	}

	/**
	 * Construct the payload for 'success'.
	 */
	function onSuccess() {
		return { boardID: boardID }
	}

	/**
	 * Construct the payload for 'failure'.
	 */
	function onFailure(err) {
		return { error: err, board: old }
	}

	return build(initial, api.deleteBoard(opts).then(onSuccess, onFailure));
}
