'use strict';

var Immutable   = require('immutable');
var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

var _settings = Immutable.Map({
	'snapToGrid':  localStorage.getItem('snap-to-grid') || false,
	'showMinimap': localStorage.getItem('show-minimap') || false,
});

/**
 * Public API for SettingsStore.
 */
var settingsStoreAPI = {
	get: get,
}

/**
 * SettingsStore implementation.
 */
module.exports = createStore(settingsStoreAPI, function(action) {
	switch(action.type) {
		case Action.CHANGE_SETTING:
			_set(action.payload.key, action.payload.value);
			this.emitChange();
			break;
	}
});

/**
 *
 */
function get(key) {
	return _settings.get(key);
}

/**
 *
 */
function _set(key, value) {
	if(_settings.has(key)) {
		_settings = _settings.set(key, value);
	}
}
