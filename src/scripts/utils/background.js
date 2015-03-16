'use strict';

var Background = require('../constants/enums').Background;

/**
 *
 */
module.exports = function background(board) {
	var backgroundURL   = null;
	var backgroundImage = null;

	if(board.background && Background[board.background]) {
		if(board.background === Background.NONE) {
			return null;
		}
		backgroundURL   = Background[board.background].url;
		backgroundImage = 'url("' + backgroundURL + '")';
	}

	return backgroundImage;
}