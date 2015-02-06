'use strict';

var LocalStorage = require('node-localstorage').LocalStorage;

before(function() {
	if(!global.localStorage) {
		global.localStorage = new LocalStorage('.tmp-storage');
	}
});
