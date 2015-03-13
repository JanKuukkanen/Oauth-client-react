'use strict';

var Background = require('../constants/enums').Background;

/**
 *
 */
module.exports = function background(board) {
	var backgroundURL   = null;
	var backgroundImage = null;

	if(board.background && board.background !== 'none') {
		backgroundURL   = Background[board.background].url;
		backgroundImage = 'url("' + backgroundURL + '")';
	}

	return backgroundImage;
}