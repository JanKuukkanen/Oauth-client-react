'use strict';

var _               = require('lodash');
var React           = require('react/addons');
var Hammer          = require('hammerjs');
var TweenState      = require('react-tween-state');
var PureRenderMixin = React.addons.PureRenderMixin;

var EditTicketDialog = require('./dialog/edit-ticket');

var Property        = require('../constants/property');
var gridify         = require('../utils/gridify');
var StateActions    = require('../actions/state');
var TicketActions   = require('../actions/ticket');
var DraggableMixin  = require('../mixins/draggable');

/**
 * Tickets are those movable little things on the board.
 */
var Ticket = React.createClass({
	mixins: [DraggableMixin, TweenState.Mixin, PureRenderMixin],

	propTypes: {
		/**
		 * The 'snap' property indicates whether the ticket should 'snap' to a
		 * grid when moved.
		 */
		snap: React.PropTypes.bool,

		/**
		 * The 'active' property indicates whether to append a '.last-active'
		 * class to the component. This is basically used to bring tickets to
		 * foreground when they are clicked.
		 */
		active: React.PropTypes.bool,

		/**
		 * The initial state of the ticket.
		 */
		ticket: Property.Ticket.isRequired,

		/**
		 * The 'id' of the board the Ticket belongs to.
		 */
		boardID: React.PropTypes.string.isRequired,
	},

	getDefaultProps: function() {
		return {
			snap:   false,
			active: false,
		}
	},

	getInitialState: function() {
		return {
			// Having internal positional state when we also receive it from
			// the 'props' passed in can be considered anti-pattern. However,
			// we are using 'react-tween-state' internal state is required.
			x: this.props.ticket.position.x,
			y: this.props.ticket.position.y,

			showEditDialog: false,
		}
	},

	componentDidMount: function() {
		// Setup HammerJS for our custom 'doubletap' event.
		this.hammer = new Hammer.Manager(this.getDOMNode());
		this.hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));

		// Setup a listener for our custom 'doubletap' event, which will toggle
		// the ticket's 'showEditDialog' state when invoked.
		this.hammer.on('doubletap', this._toggleEditDialog);

		// Setup a listener for 'dragStart' events, so that when a ticket is
		// tapped or dragged, it is moved to a '.last-active' layer.
		this.draggable.on('dragStart', function setAsActive() {
			return StateActions.setActiveTicket(this.props.ticket.id);
		}.bind(this));

		// Setup a listener for Draggable mixin's 'dragEnd' events, so we can
		// create actions that update the ticket's position.
		this.draggable.on('dragEnd', function() {
			// Don't do anything if we didn't actually move the ticket.
			var pos = this.draggable.position;
			if(this.state.x === pos.x && this.state.y === pos.y) {
				return;
			}

			// The position is just an illusion... If we have snap on...
			var endpos = this.props.snap ? gridify(pos) : pos;

			// If we are snapping the ticket, we 'tween' the position to the
			// end value, else we just set the state directly.
			if(this.props.snap) {
				this._tweenPositionTo(endpos, this.draggable.position, 100);
			}
			else {
				this.setState({ x: endpos.x, y: endpos.y });
			}

			var boardID  = this.props.boardID;
			var ticketID = this.props.ticket.id;

			return TicketActions.editTicket(boardID, ticketID, {
				position: {
					x: this.state.x,
					y: this.state.y,
				},
			});
		}.bind(this));
	},

	componentWillUnmount: function() {
		this.hammer.destroy();
		this.hammer = null;
	},

	componentWillReceiveProps: function (next) {
		// Don't tween if there is a drag going on...
		if(this.state.isDragging) return;

		// Don't wanna tween if there ain't nothing to tween to...
		if(this.state.x === next.ticket.position.x &&
		   this.state.y === next.ticket.position.y) {
			return;
		}
		return this._tweenPositionTo(next.ticket.position);
	},

	/**
	 * Passed to the Modal as dismissal function.
	 */
	_toggleEditDialog: function() {
		this.setState({ showEditDialog: !this.state.showEditDialog });
	},

	/**
	 * Uses 'tween-state' to tween the current position to the target.
	 */
	_tweenPositionTo: function(to, from, duration) {
		['x', 'y'].map(function(axis) {
			var tweeningOpts = {
				duration:   duration || 500,
				endValue:   to[axis],
				beginValue: from ? from[axis] : null,
			}
			return this.tweenState(axis, tweeningOpts);
		}.bind(this));
	},

	render: function() {
		var style = {
			top:    this.getTweeningValue('y'),
			left:   this.getTweeningValue('x'),
			zIndex: this.props.ticket.position.z,
		}
		var classes = React.addons.classSet({
			'ticket':      true,
			'last-active': this.props.active,
		});
		if(this.state.showEditDialog) {
			var editDialog = (
				/* jshint ignore:start */
				<EditTicketDialog
					ticket={this.props.ticket}
					boardID={this.props.boardID}
					onDismiss={this._toggleEditDialog} />
				/* jshint ignore:end */
			);
		}
		return (
			/* jshint ignore:start */
			<div className={classes} style={style}>
				<div className="color" style={{ backgroundColor: this.props.ticket.color }} />
				<div className="content">
					{this.props.ticket.content}
				</div>
				{editDialog}
			</div>
			/* jshint ignore:end */
		);
	},
});

module.exports = Ticket;
