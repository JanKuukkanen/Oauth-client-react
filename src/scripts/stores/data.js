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
var DataStoreAPI = {
	getBoard:   getBoard,
	getBoards:  getBoards,
	getTicket:  getTicket,
	getTickets: getTickets,
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
	return _boards.map(function(b) {
		return b.remove('tickets');
	}).toJS();
}

/**
 * Get the board specified by the given 'boardID'. Note that the returned board
 * does not contain the 'tickets'.
 */
function getBoard(boardID) {
	var board = _boards.find(function(b) {
		return b.get('id') === boardID
	});
	return board ? board.remove('tickets').toJS() : null;
}

/**
 * Get the 'tickets' of the specified Board.
 */
function getTickets(boardID) {
	var board = _boards.find(function(b) {
		return b.get('id') === boardID;
	});
	return board ? board.get('tickets').toJS() : [ ];
}

/**
 * Get a specific Ticket.
 */
function getTicket(boardID, ticketID) {
	var board = _boards.find(function(b) {
		return b.get('id') === boardID;
	});
	if(board) {
		var ticket = board.get('tickets').find(function(t) {
			return t.get('id') === ticketID;
		});
		return ticket ? ticket.toJS() : null;
	}
	return null;
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
 * Maps the IDs of the given tickets to indices based on the 'updatedAt'
 * attribute of each ticket.
 */
function _mapIDtoUpdateOrder(tickets) {
	return tickets.sortBy(function(t) { return t.get('updatedAt'); })
		.map(function(t) { return t.get('id'); }).toMap().flip();
}

/**
 * Small helper to create an immutable version of a Board from plain JS. Note
 * that this does not take into account any 'tickets'.
 */
function _board(payload, defaults) {
	// Make sure the defaults are defined.
	defaults = _.defaults(defaults || Default.BOARD, Default.BOARD);

	return Immutable.Map({
		id:         payload.id         || defaults.id,
		name:       payload.name       || defaults.name,
		background: payload.background || defaults.background,
		accessCode: payload.accessCode || defaults.accessCode,

		size: Immutable.Map({
			width:  payload.size ? payload.size.width  : defaults.size.width,
			height: payload.size ? payload.size.height : defaults.size.height,
		}),

		tickets: Immutable.List([]),
	});
}

/**
 * Small helper to create an immutable version of a Ticket from plain JS. Do
 * note that this does not create a 'position.z'.
 */
function _ticket(payload, defaults) {
	// Make sure the defaults are defined.
	defaults = _.defaults(defaults || Default.TICKET, Default.TICKET);

	return Immutable.Map({
		id:      payload.id      || defaults.id,
		color:   payload.color   || defaults.color,
		content: payload.content || defaults.content,

		position: Immutable.Map({
			x: payload.position ? payload.position.x : defaults.position.x,
			y: payload.position ? payload.position.y : defaults.position.y,
		}),

		updatedAt: payload.updatedAt || defaults.updatedAt,
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
		var index = _index(board.id, boards);

		if(index < 0) {
			return boards.push(
				_board(board).set('tickets', Immutable.List([]))
			);
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
 * Removes the specified board.
 */
function _removeBoard(boardID, boards) {
	var index = _index(boardID, boards);

	if(index >= 0) {
		return boards.remove(index);
	}
	return boards;
}

/**
 * Updates the specified board. Does not affect 'tickets'.
 */
function _editBoard(boardID, board, boards) {
	var index = _index(boardID, boards);

	if(index >= 0) {
		return boards.update(index, function(old) {
			return _board(board, old.remove('tickets').toJS())
				.set('tickets', old.get('tickets'));
		});
	}
	return boards;
}

/**
 * Adds the given Ticket(s) to the specified Board. If the given ticket is an
 * array, the 'tickets' of the specified Board are replaced by it. Calculates
 * the 'position.z' value for each ticket.
 */
function _addTicket(boardID, ticket, boards) {
	var index = _index(boardID, boards);

	if(index < 0) {
		// If there isn't a board with the given boardID, we create it so that
		// we can add tickets to it.
		boards = boards.push(Immutable.Map({ id: boardID }));
	}
	return boards.update(index, function(old) {
		if(ticket instanceof Array) {
			// Replace the old 'tickets' with the given list of tickets.
			var tickets = Immutable.List(ticket.map(_ticket));
			var mapped  = _mapIDtoUpdateOrder(tickets);

			// Calculate 'z' for each ticket based on 'updatedAt'.
			return old.set('tickets', tickets.map(function(t) {
				return t.setIn(['position', 'z'], mapped.get(t.get('id')));
			}));
		}
		// We don't calculate the 'z' for each ticket, if we just add a single
		// ticket since it is most likely on top already.
		return old.set('tickets', old.get('tickets').push(
			_ticket(ticket).setIn(['position', 'z'], old.get('tickets').size)
		));
	});
}

/**
 * Removes the specified ticket.
 */
function _removeTicket(boardID, ticketID, boards) {
	var bidx = _index(boardID, boards);

	if(bidx >= 0) {
		return boards.update(bidx, function(old) {
			var tidx = _index(ticketID, old.get('tickets'));

			if(tidx >= 0) {
				return old.set('tickets', old.get('tickets').remove(tidx));
			}
			return old;
		});
	}
	return boards;
}

/**
 * Updates the specified ticket. Calculates the 'position.z' value for each
 * ticket.
 */
function _editTicket(boardID, ticketID, ticket, boards) {
	var bidx = _index(boardID, boards);

	if(bidx >= 0) {
		return boards.update(bidx, function(old) {
			var tidx = _index(ticketID, old.get('tickets'));

			if(tidx >= 0) {
				// Note that we bind the ticket payload to the '_ticket' helper
				// so it is passed as the first argument to it.
				var tickets = old.get('tickets').update(tidx, function(old) {
					return _ticket(ticket, old.toJS());
				});
				var mapped = _mapIDtoUpdateOrder(tickets);

				// Calculate 'z' for each ticket based on 'updatedAt'.
				return old.set('tickets', tickets.map(function(t) {
					return t.setIn(['position', 'z'], mapped.get(t.get('id')));
				}));
			}
			return old;
		});
	}
	return boards;
}

module.exports = createStore(DataStoreAPI, function(action) {
	switch(action.type) {
		case Action.LOAD_BOARDS_SUCCESS:
			_boards = _addBoard(action.payload.boards, _boards);
			this.emitChange();
			break;

		case Action.LOAD_TICKETS_SUCCESS:
			_boards = _addTicket(
				action.payload.boardID,
				action.payload.tickets,
				_boards
			);
			this.emitChange();
			break;

		case Action.ADD_BOARD:
			_boards = _addBoard(action.payload.board, _boards);
			this.emitChange();
			break;

		case Action.ADD_BOARD_SUCCESS:
			_boards = _editBoard(
				action.payload.boardID,
				{ id: action.payload.cleanID },
				_boards
			);
			this.emitChange();
			break;

		case Action.ADD_BOARD_FAILURE:
			_boards = _removeBoard(action.payload.boardID, _boards);
			this.emitChange();
			break;

		case Action.ADD_TICKET:
			_boards = _addTicket(
				action.payload.boardID,
				action.payload.ticket,
				_boards
			);
			this.emitChange();
			break;

		case Action.ADD_TICKET_SUCCESS:
			_boards = _editTicket(
				action.payload.boardID,
				action.payload.dirtyID,
				{ id: action.payload.cleanID },
				_boards
			);
			this.emitChange();
			break;

		case Action.ADD_TICKET_FAILURE:
			_boards = _removeTicket(
				action.payload.boardID,
				action.payload.ticketID,
				_boards
			);
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

		case Action.EDIT_TICKET:
		case Action.EDIT_TICKET_FAILURE:
			_boards = _editTicket(
				action.payload.boardID,
				action.payload.ticketID,
				action.payload.ticket,
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
			_boards = _addTicket(
				action.payload.board.id,
				action.payload.board.tickets,
				_boards
			);
			this.emitChange();
			break;

		case Action.REMOVE_TICKET:
			_boards = _removeTicket(
				action.payload.boardID,
				action.payload.ticketID,
				_boards
			);
			this.emitChange();
			break;

		case Action.REMOVE_TICKET_FAILURE:
			_boards = _addTicket(
				action.payload.boardID,
				action.payload.ticket,
				_boards
			);
			this.emitChange();
			break;
	}
});
