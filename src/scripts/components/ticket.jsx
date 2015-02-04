'use strict';

var _          = require('lodash');
var React      = require('react/addons');
var Hammer     = require('hammerjs');
var TweenState = require('react-tween-state');

var Stripe           = require('./stripe.jsx');
var TicketEditDialog = require('./ticket-edit-dialog.jsx');

var TicketColor   = require('../constants/enums').TicketColor;
var TicketActions = require('../actions/ticket');

var DraggableMixin  = require('../mixins/draggable');
var PureRenderMixin = React.addons.PureRenderMixin;

var gridify = require('../utils/gridify');

/**
 *
 */
var Ticket = React.createClass({
	mixins: [DraggableMixin, TweenState.Mixin, PureRenderMixin],

	propTypes: {
		/**
		 *
		 */
		snap: React.PropTypes.bool,

		/**
		 *
		 */
		active: React.PropTypes.bool,

		/**
		 *
		 */
		id: React.PropTypes.string.isRequired,

		/**
		 *
		 */
		color: React.PropTypes.oneOf(_.values(TicketColor)).isRequired,

		/**
		 *
		 */
		content: React.PropTypes.string.isRequired,

		/**
		 *
		 */
		position: React.PropTypes.shape({
			x: React.PropTypes.number.isRequired,
			y: React.PropTypes.number.isRequired,
			z: React.PropTypes.number.isRequired,
		}).isRequired,
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
			x: this.props.position.x,
			y: this.props.position.y,

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
			TicketActions.setActiveTicket({ id: this.props.id });
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

			TicketActions.editTicket({
				id: this.props.id,
				position: {
					x: this.state.x,
					y: this.state.y,
				}
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
		if(this.state.x === next.position.x
		&& this.state.y === next.position.y) {
			return;
		}
		return this._tweenPositionTo(next.position);
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
			zIndex: this.props.position.z,
		}
		var classes = React.addons.classSet({
			'ticket':      true,
			'last-active': this.props.active,
		});

		if(this.state.showEditDialog) {
			var editDialog = (
				<TicketEditDialog id={this.props.id}
					color={this.props.color}
					content={this.props.content}
					onDismiss={this._toggleEditDialog} />
			);
		}

		return (
			<div className={classes} style={style}>
				<Stripe color={this.props.color} />
				<div className="content">
					{this.props.content}
				</div>
				{editDialog}
			</div>
		);
	},
});

module.exports = Ticket;
