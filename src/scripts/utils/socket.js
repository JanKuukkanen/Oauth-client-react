'use strict';

var _       = require('lodash');
var io      = require('socket.io-client');
var Promise = require('promise');

var BoardStore    = require('../stores/board');
var BoardActions  = require('../actions/board');
var TicketActions = require('../actions/ticket');

/**
 * Public interface.
 */
module.exports = {
	connect:    connect,
	disconnect: disconnect,
}

/**
 * Keeping track of boards we have joined.
 */
var _rooms = [ ];

/**
 * Reference to our socket instance.
 */
var _socket = null;

/**
 * We declare the possible events here as 'constants'.
 */
var JOIN_EVENT = 'board:join';
var DATA_EVENT = 'board:event';

/**
 * Creates a new 'socket.io' connection. Doesn't do anything if a connection is
 * already present.
 *
 * Note that this also attaches the event handlers for listening to changes, so
 * don't worry about them. We also keep track of the boards currently in store,
 * so we can join their respective rooms.
 *
 * @param {object} opts        Options for the connection.
 * @param {string} opts.url    URL of the socket service.
 * @param {string} opts.token  Handshake token sent as a query parameter.
 *
 * @returns {Promise}  Resolved when a connection is established. Rejected if
 *                     an error occurs with the connection.
 */
function connect(opts) {
	var url = opts.url;
	var options = {
		query:    'access-token=' + opts.token + '',
		multplex: false,
	}
	return new Promise(function(resolve, reject) {
		if(_socket && _socket.connected) {
			return resolve();
		}

		/**
		 *
		 */
		function onConnectionSuccess() {
			// Store a reference to the connected socket and attach a listener
			// to receive any data. Note we only have a single event, see the
			// implementation of 'teamboard-api' for reasons.
			_socket = this;
			_socket.on(DATA_EVENT, _onData);

			// Join the boards we currently have in store. Attach a listener
			// for listening to changes in BoardStore.
			_joinBoards();
			BoardStore.addChangeListener(_joinBoards);

			return resolve();
		}

		/**
		 *
		 */
		function onConnectionFailure(err) {
			// TODO Handle the error somehow, probably throw it in ErrorStore?
			return reject(err);
		}

		return io(url, options)
			.on('error',   onConnectionFailure)
			.on('connect', onConnectionSuccess);
	});
}

/**
 *
 */
function disconnect() {
	if(_socket && _socket.connected) {
		// Don't disconnect if there wasn't a connection in the first place.
		_socket.disconnect();
	}

	// Clear our 'state', or whatever...
	_rooms  = [ ];
	_socket = null;

	// Make sure to clear any listeners... I think it's ok to try and remove a
	// listener that might not have been attached in the first place?
	BoardStore.removeChangeListener(_joinBoards);
}

/**
 * Joins rooms (or boards) at socket level, based on BoardStore.
 *
 * TODO We should really define the 'dirty' here as a constant at application
 *      level, so it doesn't get lost in the jungle of code and stuff.
 */
function _joinBoards() {
	if(!_socket || !_socket.connected) {
		return null;
	}

	var dirty    = 'dirty';
	var boardIDs = _.pluck(BoardStore.getBoards(), 'id');

	_.difference(boardIDs, _rooms).forEach(function(id) {
		// If the board is 'dirty', not yet server approved, we don't join it.
		if(id.substring(0, dirty.length) === dirty) {
			return null;
		}
		// Attempt to join the room, back out if an error occurs.
		_rooms.push(id);
		_socket.emit(JOIN_EVENT, { board: id }, function(err) {
			if(err) {
				_rooms = _.without(_rooms, id);
				return console.error(err);
			}
			return console.log('socket:join:', id);
		});
	});
}

/**
 *
 * TODO Move 'type' to constants.
 */
function _onData(data) {
	switch(data.type) {
		case 'BOARD_EDIT':
			break;
		case 'BOARD_REMOVE':
			break;
		case 'TICKET_ADD':
			break;
		case 'TICKET_EDIT':
			break;
		case 'TICKET_REMOVE':
			break;
	}
}
