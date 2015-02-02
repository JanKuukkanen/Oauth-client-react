'use strict';

var assign       = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var Dispatcher = require('../dispatcher');

var CHANGE_EVENT = 'change';

/**
 * Creates a Flux Store.
 *
 * @param {object}   exports   Defines the 'public' interface of the store.
 * @param {function} callback  Callback registered to listen to the Dispatcher.
 *
 * @returns {object}  Store object, which is also an EventEmitter.
 */
function createStore(exports, callback) {
	var store = assign(new EventEmitter(), {
		emitChange: function() {
			this.emit(CHANGE_EVENT);
		},

		addChangeListener: function(callback) {
			this.addListener(CHANGE_EVENT, callback);
		},

		removeChangeListener: function(callback) {
			this.removeListener(CHANGE_EVENT, callback);
		},
	});

	store               = assign(store, exports);
	store.dispatchToken = Dispatcher.register(callback.bind(store));

	return store;
}

module.exports = createStore;
