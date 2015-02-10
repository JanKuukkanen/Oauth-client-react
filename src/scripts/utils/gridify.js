'use strict';

var TICKET_WIDTH  = require('../constants').TICKET_WIDTH;
var TICKET_HEIGHT = require('../constants').TICKET_HEIGHT;

/**
 * Simple helper function to snap a position to grid.
 *
 * @param {object} position    The position to snap.
 * @param {number} position.x
 * @param {number} position.y
 *
 * @returns {object} The snapped position.
 */
module.exports = function gridify(position) {
	return {
		x: Math.round(position.x / TICKET_WIDTH)  * TICKET_WIDTH,
		y: Math.round(position.y / TICKET_HEIGHT) * TICKET_HEIGHT,
	}
}
