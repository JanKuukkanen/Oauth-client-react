'use strict';

var api        = require('../utils/api');
var Action     = require('../constants/actions');
var Dispatcher = require('../dispatcher');

var AuthStore = require('../stores/auth');
var DataStore = require('../stores/data');

/**
 * The methods exported by TicketActions
 */
module.exports = {
	loadBoards:  loadBoards,
	loadTickets: loadTickets,

	addBoard:  addBoard,
	addTicket: addTicket,

	editBoard:  editBoard,
	editTicket: editTicket,

	removeBoard:  removeBoard,
	removeTicket: removeTicket,
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
 */
function loadTickets(boardID) {
	Dispatcher.dispatch({ type: Action.LOAD_TICKETS });

	function onSuccess(tickets) {
		Dispatcher.dispatch({
			payload: {
				boardID: boardID,
				tickets: tickets,
			},
			type: Action.LOAD_TICKETS_SUCCESS,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			payload: {
				error: err,
			},
			type: Action.LOAD_TICKETS_FAILURE,
		});
	}

	var opts = {
		id: {
			board: boardID,
		},
		token: AuthStore.getToken(),
	}
	return api.getTickets(opts).then(onSuccess, onError);
}

/**
 *
 * TODO Make the ID generation into its own utility function.
 */
function addBoard(dirtyBoard) {
	dirtyBoard.id = Math.random().toString(36).substr(2, 9);

	Dispatcher.dispatch({
		type:    Action.ADD_BOARD,
		payload: dirtyBoard,
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
 * TODO Make the ID generation into its own utility function.
 */
function addTicket(boardID, dirtyTicket) {
	dirtyTicket.id = Math.random().toString(36).substr(2, 9);

	Dispatcher.dispatch({
		payload: {
			ticket:  dirtyTicket,
			boardID: boardID,
		},
		type: Action.ADD_TICKET,
	});

	function onSuccess(cleanTicket) {
		Dispatcher.dispatch({
			payload: {
				boardID: boardID,
				dirtyID: dirtyTicket.id,
				cleanID: cleanTicket.id,
			},
			type: Action.ADD_TICKET_SUCCESS,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			payload: {
				error:    err,
				boardID:  boardID,
				ticketID: dirtyTicket.id,
			},
			type: Action.ADD_TICKET_FAILURE,
		});
	}

	var opts = {
		id: {
			board: boardID,
		},
		token:   AuthStore.getToken(),
		payload: dirtyTicket,
	}
	return api.createTicket(opts).then(onSuccess, onError);
}

/**
 *
 */
function editBoard(boardID, dirtyBoard) {
	var oldBoard = DataStore.getBoard(boardID);

	Dispatcher.dispatch({
		type:    Action.EDIT_BOARD,
		payload: dirtyBoard,
	});

	function onSuccess(cleanBoard) {
		Dispatcher.dispatch({
			type:    Action.EDIT_BOARD_SUCCESS,
			payload: cleanBoard,
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
function editTicket(boardID, ticketID, dirtyTicket) {
	var oldTicket             = DataStore.getTicket(boardID, ticketID);
	    dirtyTicket.updatedAt = Date.now();

	Dispatcher.dispatch({
		payload: {
			ticket:   dirtyTicket,
			boardID:  boardID,
			ticketID: ticketID,
		},
		type: Action.EDIT_TICKET,
	});

	function onSuccess(cleanTicket) {
		Dispatcher.dispatch({
			payload: {
				ticket:   cleanTicket,
				boardID:  boardID,
				ticketID: ticketID,
			},
			type: Action.EDIT_TICKET_SUCCESS,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			payload: {
				error:    err,
				boardID:  boardID,
				ticket:   oldTicket,
				ticketID: oldTicket.id
			},
			type: Action.EDIT_TICKET_FAILURE,
		});
	}

	var opts = {
		id: {
			board:  boardID,
			ticket: ticketID,
		},
		token:   AuthStore.getToken(),
		payload: dirtyTicket,
	}
	return api.updateTicket(opts).then(onSuccess, onError);
}

/**
 *
 */
function removeBoard(boardID) {
	var oldBoard         = DataStore.getBoard(boardID);
	    oldBoard.tickets = DataStore.getTickets(boardID);

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

/**
 *
 */
function removeTicket(boardID, ticketID) {
	var oldTicket = DataStore.getTicket(boardID, ticketID);

	Dispatcher.dispatch({
		payload: {
			boardID:  boardID,
			ticketID: ticketID,
		},
		type: Action.REMOVE_TICKET,
	});

	function onSuccess() {
		Dispatcher.dispatch({
			payload: {
				boardID:  boardID,
				ticketID: ticketID,
			},
			type: Action.REMOVE_TICKET_SUCCESS,
		});
	}

	function onError(err) {
		Dispatcher.dispatch({
			payload: {
				error:   err,
				ticket:  oldTicket,
				boardID: boardID,
			},
			type: Action.REMOVE_TICKET_FAILURE,
		});
	}

	var opts = {
		id: {
			board:  boardID,
			ticket: ticketID,
		},
		token: AuthStore.getToken(),
	}
	return api.deleteTicket(opts).then(onSuccess, onError);
}
