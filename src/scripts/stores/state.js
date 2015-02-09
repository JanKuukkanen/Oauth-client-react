'use strict';

var Immutable = require('immutable');

var Action      = require('../constants/actions');
var createStore = require('../utils/create-store');

/**
 *
 */
var _active = null;

/**
 *
 */
var _settings = localStorage.getItem('settings') ?
	Immutable.fromJS(JSON.parse(localStorage.getItem('settings'))) :
	Immutable.Map({
		snapToGrid:  false,
		showMinimap: false,
	});

/**
 *
 */
var StateStoreAPI = {
	getSetting:      getSetting,
	getActiveTicket: getActiveTicket,
}

/**
 *
 */
function getSetting(key) {
	return _settings.get(key);
}

/**
 *
 */
function getActiveTicket() {
	return _active;
}

/**
 *
 */
function _setSetting(key, value) {
	if(_settings.has(key)) {
		var settings     = _settings.set(key, value);
		var settingsJSON = JSON.stringify(settings.toJS());

		localStorage.setItem('settings', settingsJSON);
		return settings;
	}
}

/**
 * State implementation.
 */
module.exports = createStore(StateStoreAPI, function(action) {
	switch(action.type) {
		/**
		 *
		 */
		case Action.CHANGE_SETTING:
			_settings = _setSetting(
				action.payload.key,
				action.payload.value
			);
			this.emitChange();
			break;

		/**
		 *
		 */
		case Action.SET_ACTIVE_TICKET:
			_active = action.payload.id;
			this.emitChange();
			break;
	}
});
