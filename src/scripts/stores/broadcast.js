'use strict';

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

/**
 * Error descriptions are laid out first by failure type, and then by the error
 * specific status code, if any.
 */
var ErrorDescription = {
	LOGIN_FAILURE: {
		status: {
			400: 'Bad credentials.',
			401: 'Authentication failed. Check your credentials.',
		},
		default: 'Login failed.',
	},
	REGISTER_FAILURE: {
		status: {
			400: 'Bad username or password.',
			409: 'User already exists.',
		},
		default: 'Registration failed.',
	},
	AUTHENTICATION_FAILURE: {
		default: 'Login session expired or invalid.',
	},
}

var broadcasts = {
	seen:   [ ],
	unseen: [ ],
}

var broadcastStore = createStore.bind(null, {
	getBroadcasts: function() {
		return broadcasts.unseen;
	}
});

/**
 *
 */
module.exports = broadcastStore(function(action) {
	// NOTE This is a temporary solution, refactor actions to generate simple
	//      broadcast events in addition to the failures.
	if(action.payload && action.payload.error) {
		var error      = action.payload.error || new Error();
		    error.type = action.type;

		if(ErrorDescription[action.type]) {
			var errorDescription = ErrorDescription[action.type];

			if(error.statusCode) {
				error.description = errorDescription.status[error.statusCode];
			}
			else {
				error.description = errorDescription.default;
			}
		}
		else {
			error.description = action.type;
		}

		broadcasts.unseen.push({
			at:      Date.now(),
			type:    'error',
			content: error.description,
		});

		return this.emitChange();
	}

	switch(action.type) {
		case Action.NEW_BROADCAST:
			broadcasts.unseen.push({
				at:      Date.now(),
				type:    'broadcast',
				content: action.payload.content,
			});
			this.emitChange();
			break;

		case Action.MARK_BROADCAST_AS_SEEN:
			var index = broadcasts.unseen.indexOf(action.payload);
			if(index >= 0) {
				broadcasts.seen.push(broadcasts.unseen.splice(index, 1)[0]);
			}
			this.emitChange();
			break;
	}
});
