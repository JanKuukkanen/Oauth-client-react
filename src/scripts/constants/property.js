'use strict';

var _     = require('lodash');
var React = require('react');

var UserTypes    = _.values(require('../constants/enums').UserType);
var TicketColors = _.values(require('../constants/enums').TicketColor);

/**
 *
 */
var Property = { }

/**
 *
 */
Property.Size = React.PropTypes.shape({
	width:  React.PropTypes.number.isRequired,
	height: React.PropTypes.number.isRequired,
});

/**
 *
 */
Property.Position = React.PropTypes.shape({
	x: React.PropTypes.number.isRequired,
	y: React.PropTypes.number.isRequired,
	z: React.PropTypes.number.isRequired,
});

/**
 *
 */
Property.User = React.PropTypes.shape({
	id:   React.PropTypes.string.isRequired,
	name: React.PropTypes.string.isRequired,
	type: React.PropTypes.oneOf(UserTypes).isRequired,
});

/**
 *
 */
Property.Board = React.PropTypes.shape({
	id:         React.PropTypes.string.isRequired,
	name:       React.PropTypes.string.isRequired,
	size:       Property.Size.isRequired,
	background: React.PropTypes.string,
	accessCode: React.PropTypes.string,
});

/**
 *
 */
Property.Ticket = React.PropTypes.shape({
	id:       React.PropTypes.string.isRequired,
	color:    React.PropTypes.oneOf(TicketColors).isRequired,
	content:  React.PropTypes.string,
	position: Property.Position.isRequired,
});

module.exports = Property;
