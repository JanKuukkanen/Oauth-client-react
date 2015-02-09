'use strict';

var Immutable = require('immutable');

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

/**
 *
 */
var DataStoreAPI = {
	getBoard:  getBoard,
	getBoards: getBoards,

	getTicket:  getTicket,
	getTickets: getTickets,
}

/**
 * Represents the structure of data inside our application.
 */
var _boards = Immutable.List([]);

/**
 *
 */
function getBoards() {
	return _boards.map(function(b) {
		return b.remove('tickets');
	}).toJS();
}

/**
 *
 */
function getBoard(boardID) {
	var defaultBoard = {
		id:   boardID,
		size: { width: 0, height: 0 }
	}
	var board = _boards.find(function(b) {
		return b.get('id') === boardID
	});
	return board ? board.remove('tickets').toJS() : defaultBoard;
}

/**
 *
 */
function getTickets(boardID) {
	var board = _boards.find(function(b) {
		return b.get('id') === boardID;
	});
	return board ? board.get('tickets').toJS() : [];
}

/**
 *
 */
function getTicket(boardID, ticketID) {
	var defaultTicket = {
		id:       ticketID,
		position: { x: 0, y: 0, z: 0 }
	}
	var board = _boards.find(function(b) {
		return b.get('id') === boardID;
	});
	if(board) {
		var ticket = board.get('tickets').find(function(t) {
			return t.get('id') === ticketID;
		});
		return ticket ? ticket.toJS() : defaultTicket;
	}
	return defaultTicket;
}

/**
 *
 */
function _addBoard(nBoard) {
	if(nBoard instanceof Array) {
		nBoard.forEach(function(board) {
			_boards = _addBoard(board);
		});
		return _boards;
	}
	var index = _boards.findIndex(function(b) {
		return b.get('id') === nBoard.id;
	});
	if(index < 0) {
		return _boards.push(Immutable.Map({
			id:         nBoard.id,
			name:       nBoard.name,
			accessCode: nBoard.accessCode,
			background: nBoard.background,
			size:       Immutable.Map(nBoard.size),
			tickets:    Immutable.List([]),
		}));
	}
	return _editBoard(nBoard.id, nBoard);
}

/**
 *
 */
function _removeBoard(boardID) {
	var index = _boards.findIndex(function(b) {
		return b.get('id') === boardID;
	});
	if(index < 0) {
		return _boards;
	}
	return _boards.remove(index);
}

/**
 *
 */
function _editBoard(boardID, uBoard) {
	var index = _boards.findIndex(function(b) {
		return b.get('id') === boardID;
	});
	if(index < 0) {
		return _boards;
	}
	return _boards.update(index, function(old) {
		return Immutable.Map({
			id:         uBoard.id         || old.get('id'),
			name:       uBoard.name       || old.get('name'),
			accessCode: uBoard.accessCode || old.get('accessCode'),
			background: uBoard.background || old.get('background'),

			size: uBoard.size ?
				Immutable.Map(uBoard.size) : old.get('size'),

			tickets: old.get('tickets'),
		});
	});
}

/**
 * Adds the given Ticket(s) to the specified Board. If the given ticket is an
 * array, the 'tickets' of the specified Board are replaced by it.
 */
function _addTicket(boardID, newTicket) {
	var index = _boards.findIndex(function(b) {
		return b.get('id') === boardID;
	});
	if(index < 0) {
		_boards = _boards.push(Immutable.Map({ id: boardID }));
	}
	return _boards.update(index, function(board) {
		if(newTicket instanceof Array) {
			var newTickets = newTicket.map(function(ticket) {
				return Immutable.Map({
					id:       ticket.id,
					color:    ticket.color,
					content:  ticket.content,
					position: Immutable.Map({
						x: ticket.position.x,
						y: ticket.position.y,
					}),
					updatedAt: ticket.updatedAt,
				});
			});
			return board.set('tickets', Immutable.List(newTickets));
		}
		return board.set('tickets', board.get('tickets').push(Immutable.Map({
			id:       newTicket.id,
			color:    newTicket.color,
			content:  newTicket.content,
			position: Immutable.Map({
				x: newTicket.position.x,
				y: newTicket.position.y,
			}),
			updatedAt: newTicket.updatedAt,
		})));
	});
}

/**
 *
 */
function _removeTicket(boardID, ticketID) {
	var boardIndex = _boards.findIndex(function(b) {
		return b.get('id') === boardID;
	});
	if(boardIndex < 0) {
		return _boards;
	}
	return _boards.update(boardIndex, function(board) {
		var ticketIndex = board.get('tickets').findIndex(function(t) {
			return t.get('id') === ticketID;
		});
		if(ticketIndex < 0) {
			return board;
		}
		return board.set('tickets', board.get('tickets').remove(ticketIndex));
	});
}

/**
 *
 */
function _editTicket(boardID, ticketID, uTicket) {
	var boardIndex = _boards.findIndex(function(b) {
		return b.get('id') === boardID;
	});
	if(boardIndex < 0) {
		return _boards;
	}
	return _boards.update(boardIndex, function(oldBoard) {
		var ticketIndex = oldBoard.get('tickets').findIndex(function(t) {
			return t.get('id') === ticketID;
		});
		if(ticketIndex < 0) {
			return oldBoard;
		}
		return oldBoard.set('tickets',
			oldBoard.get('tickets').update(ticketIndex, function(oldTicket) {
				return Immutable.Map({
					id:      uTicket.id      || oldTicket.get('id'),
					color:   uTicket.color   || oldTicket.get('color'),
					content: uTicket.content || oldTicket.get('content'),

					position: uTicket.position ? Immutable.Map({
						x: uTicket.position.x,
						y: uTicket.position.y,
					}) : oldTicket.get('position'),

					updatedAt: uTicket.updatedAt,
				});
			}));
	});
}

/**
 *
 */
module.exports = createStore(DataStoreAPI, function(action) {
	switch(action.type) {
		/**
		 *
		 */
		case Action.LOAD_BOARDS_SUCCESS:
			_boards = _addBoard(action.payload.boards);
			this.emitChange();
			break;

		/**
		 *
		 */
		case Action.LOAD_TICKETS_SUCCESS:
			_boards = _addTicket(
				action.payload.boardID,
				action.payload.tickets
			);
			this.emitChange();
			break;

		/**
		 *
		 */
		case Action.ADD_BOARD:
			_boards = _addBoard(action.payload);
			this.emitChange();
			break;
		case Action.ADD_BOARD_SUCCESS:
			_boards = _editBoard(
				action.payload.dirtyID,
				{ id: action.payload.cleanID }
			);
			this.emitChange();
			break;
		case Action.ADD_BOARD_FAILURE:
			_boards = _removeBoard(action.payload.boardID);
			this.emitChange();
			break;

		/**
		 *
		 */
		case Action.ADD_TICKET:
			_boards = _addTicket(
				action.payload.boardID,
				action.payload.ticket
			);
			this.emitChange();
			break;
		case Action.ADD_TICKET_SUCCESS:
			_boards = _editTicket(
				action.payload.boardID,
				action.payload.dirtyID,
				{ id: action.payload.cleanID }
			);
			this.emitChange();
			break;
		case Action.ADD_TICKET_FAILURE:
			_boards = _removeTicket(
				action.payload.boardID,
				action.payload.ticketID
			);
			this.emitChange();
			break;

		/**
		 *
		 */
		case Action.EDIT_BOARD:
		case Action.EDIT_BOARD_FAILURE:
			_boards = _editBoard(
				action.payload.boardID,
				action.payload.board
			);
			this.emitChange();
			break;

		/**
		 *
		 */
		case Action.EDIT_TICKET:
		case Action.EDIT_TICKET_FAILURE:
			_boards = _editTicket(
				action.payload.boardID,
				action.payload.ticketID,
				action.payload.ticket
			);
			this.emitChange();
			break;

		/**
		 *
		 */
		case Action.REMOVE_BOARD:
			_boards = _removeBoard(action.payload.boardID);
			this.emitChange();
			break;
		case Action.REMOVE_BOARD_FAILURE:
			_boards = _addBoard(action.payload.board);
			_boards = _addTicket(
				action.payload.board.id,
				action.payload.board.tickets
			);
			this.emitChange();
			break;

		/**
		 *
		 */
		case Action.REMOVE_TICKET:
			_boards = _removeTicket(
				action.payload.boardID,
				action.payload.ticketID
			);
			this.emitChange();
			break;
		case Action.REMOVE_TICKET_FAILURE:
			_boards = _addTicket(
				action.payload.boardID,
				action.payload.ticket
			);
			this.emitChange();
			break;
	}
});
