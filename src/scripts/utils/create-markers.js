'use strict';

var TICKET_WIDTH  = require('../constants').TICKET_WIDTH;
var TICKET_HEIGHT = require('../constants').TICKET_HEIGHT;

/**
 *
 */
module.exports = function createMarkers(tickets) {
	return tickets.map(function createMarker(t) {
		return {
			size: {
				width:  TICKET_WIDTH,
				height: TICKET_HEIGHT,
			},
			position: {
				x: t.position.x,
				y: t.position.y,
				z: t.position.z,
			},
			key:   t.id,
			color: t.color,
		}
	});
}
