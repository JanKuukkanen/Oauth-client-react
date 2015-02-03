'use strict';

var api        = require('../utils/api');
var Action     = require('../constants/actions');
var AuthStore  = require('../stores/auth');
var Dispatcher = require('../dispatcher');

/**
 *
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
function addBoard() {

}

/**
 *
 */
function editBoard() {

}

/**
 *
 */
function loadBoards() {
	Dispatcher.dispatch({ type: Action.LOAD_BOARDS });

	function onLoadBoardsSuccess(boards) {
		Dispatcher.dispatch({
			type:    Action.LOAD_BOARDS_SUCCESS,
			payload: boards,
		});
	}

	function onLoadBoardsFailure(err) {
		Dispatcher.dispatch({
			type:    Action.LOAD_BOARDS_FAILURE,
			payload: err,
		});
	}

	return api.getBoards({ token: AuthStore.getToken() })
		.then(onLoadBoardsSuccess, onLoadBoardsFailure);
}

/**
 *
 */
function removeBoard() {

}

