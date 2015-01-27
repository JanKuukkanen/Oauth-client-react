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
	var store = assign({}, EventEmitter.prototype, {
		/**
		 * Emits a 'change' event.
		 */
		emitChange: function() {
			this.emit(CHANGE_EVENT);
		},

		/**
		 * Encapsulates the 'EventEmitter.on' method.
		 */
		addChangeListener: function(callback) {
			this.on(CHANGE_EVENT, callback);
		},

		/**
		 * Encapsulates the 'EventEmitter.off' method.
		 */
		removeChangeListener: function(callback) {
			this.off(CHANGE_EVENT, callback);
		},
	});

	store                 = assign(store, exports);
	store.dispatcherToken = Dispatcher.register(callback.bind(store));

	return store;
}

module.exports = createStore;
