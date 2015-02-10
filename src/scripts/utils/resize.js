'use strict';

var TICKET_WIDTH  = require('../constants').TICKET_WIDTH;
var TICKET_HEIGHT = require('../constants').TICKET_HEIGHT;

/**
 * Resizes the given Board's 'size', which is normally represented in number of
 * tickets in each axis, to the real pixel size.
 *
 * @param {object} board
 * @param {object} board.size
 * @param {number} board.size.width
 * @param {number} board.size.height
 *
 * @returns {object}  The given 'board', with the 'board.size' converted to the
 *                    real pixel values.
 */
module.exports = function resize(board) {
	board.size.width  = board.size.width  * TICKET_WIDTH;
	board.size.height = board.size.height * TICKET_HEIGHT;
	return board;
}
