'use strict';

var React     = require('react');
var FastClick = require('fastclick')(document.body);

var BoardView = require('./views/board.jsx');


var boardView = React.createElement(BoardView, {
	id: '123',
});

React.render(boardView, document.body);
