'use strict';

var _     = require('lodash');
var React = require('react');

var UserTypes    = _.values(require('../constants/enums').UserType);
var TicketColors = _.values(require('../constants/enums').TicketColor);

var user = React.PropTypes.shape({
	id:   React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired,
	type: React.PropTypes.oneOf(UserTypes).isRequired,
});

var size = React.PropTypes.shape({
	width:  React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
});

var position = React.PropTypes.shape({
	x: React.PropTypes.number.isRequired,
	y: React.PropTypes.number.isRequired,
	z: React.PropTypes.number.isRequired,
});

var board = React.PropTypes.shape({
	id:         React.PropTypes.string.isRequired,
	name:       React.PropTypes.string.isRequired,
	size:       size.isRequired,
	background: React.PropTypes.string,
	accessCode: React.PropTypes.string,
});

var ticket = React.PropTypes.shape({
	id:       React.PropTypes.string.isRequired,
	color:    React.PropTypes.oneOf(TicketColors).isRequired,
	content:  React.PropTypes.string,
	position: position.isRequired,
});

module.exports = {
	User:     user,
	Size:     size,
	Board:    board,
	Ticket:   ticket,
	Position: position,
}
