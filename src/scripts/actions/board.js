'use strict';

var api        = require('../utils/api');
var Action     = require('../constants/actions');
var Dispatcher = require('../dispatcher');

var AuthStore  = require('../stores/auth');
var BoardStore = require('../stores/board');

/**
 * The methods exported by BoardActions
 *
 * TODO Create an 'action-builder.js'.
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
	Dispatcher.dispatch({ type: Action.LOAD_BOARDS });

	function onSuccess(boards) {
		Dispatcher.dispatch({
			payload: {
				boards: boards,
			},
			type: Action.LOAD_BOARDS_SUCCESS,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			payload: {
				error: err,
			},
			type: Action.LOAD_BOARDS_FAILURE,
		});
	}

	return api.getBoards({ token: AuthStore.getToken() })
		.then(onSuccess, onError);
}

/**
 *
 * TODO Make the ID generation into its own utility function.
 */
function addBoard(dirtyBoard) {
	dirtyBoard.id = Math.random().toString(36).substr(2, 9);

	Dispatcher.dispatch({
		payload: {
			board: dirtyBoard,
		},
		type: Action.ADD_BOARD,
	});

	function onSuccess(cleanBoard) {
		Dispatcher.dispatch({
			payload: {
				cleanID: cleanBoard.id,
				dirtyID: dirtyBoard.id,
			},
			type: Action.ADD_BOARD_SUCCESS,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			payload: {
				error:   err,
				boardID: dirtyBoard.id,
			},
			type: Action.ADD_BOARD_FAILURE,
		});
	}

	var opts = {
		token:   AuthStore.getToken(),
		payload: dirtyBoard,
	}
	return api.createBoard(opts).then(onSuccess, onError);
}

/**
 *
 */
function editBoard(boardID, dirtyBoard) {
	var oldBoard = BoardStore.getBoard(boardID);

	Dispatcher.dispatch({
		payload: {
			board:   dirtyBoard,
			boardID: boardID,
		},
		type: Action.EDIT_BOARD,
	});

	function onSuccess(cleanBoard) {
		Dispatcher.dispatch({
			payload: {
				board:   cleanBoard,
				boardID: boardID,
			},
			type: Action.EDIT_BOARD_SUCCESS,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			payload: {
				error:   err,
				board:   oldBoard,
				boardID: oldBoard.id,
			},
			type: Action.EDIT_BOARD_FAILURE,
		});
	}

	var opts = {
		id: {
			board: boardID,
		},
		token:   AuthStore.getToken(),
		payload: dirtyBoard,
	}
	return api.updateBoard(opts).then(onSuccess, onError);
}

/**
 *
 */
function removeBoard(boardID) {
	var oldBoard = BoardStore.getBoard(boardID);

	Dispatcher.dispatch({
		payload: {
			boardID: boardID,
		},
		type: Action.REMOVE_BOARD,
	});

	function onSuccess() {
		Dispatcher.dispatch({
			payload: {
				boardID: boardID,
			},
			type: Action.REMOVE_BOARD_SUCCESS,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			payload: {
				board: oldBoard,
				error: err,
			},
			type: Action.REMOVE_BOARD_FAILURE,
		});
	}

	var opts = {
		id: {
			board: boardID,
		},
		token: AuthStore.getToken(),
	}
	return api.deleteBoard(opts).then(onSuccess, onError);
}
