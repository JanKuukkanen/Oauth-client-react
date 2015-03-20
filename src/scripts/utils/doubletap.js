'use strict';

var Hammer = require('hammerjs');

/**
 *
 */
function doubletap(element) {
	var hammer = new Hammer.Manager(element);

	hammer.add(new Hammer.Tap({
		event:        'doubletap',
		taps:         2,
		interval:     500,
		threshold:    16,
		posThreshold: 16
	}));

	return hammer;
}

module.exports = doubletap;
