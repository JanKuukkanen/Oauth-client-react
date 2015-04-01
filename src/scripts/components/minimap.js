import React     from 'react/addons';
import immutable from 'immutable';

import Board  from '../models/board';
import Ticket from '../models/ticket';

/**
 *
 */
const Marker = React.createClass({
	propTypes: {
		ticket: (props) => {
			if(!props.ticket instanceof Ticket) throw new Error();
		},
		scale: React.PropTypes.number.isRequired
	},

	shouldComponentUpdate(nextProps) {
		let prevProps = this.props;
		let havePropsChanged = (
			prevProps.scale !== nextProps.scale               ||
			!immutable.is(prevProps.ticket, nextProps.ticket)
		);
		return havePropsChanged;
	},

	render() {
		let style = {
			top:  Math.round(this.props.scale * this.props.ticket.position.y),
			left: Math.round(this.props.scale * this.props.ticket.position.x),

			width:  Math.round(this.props.scale * Ticket.Width),
			height: Math.round(this.props.scale * Ticket.Height),

			zIndex:          this.props.ticket.position.z,
			backgroundColor: this.props.ticket.color
		}
		return <div className="marker" style={style} />;
	}
});

/**
 *
 */
export default React.createClass({
	propTypes: {
		show: React.PropTypes.bool,

		size: (props) => {
			if(!props.size instanceof Board.Size)
				throw new Error();
		},

		background: (props) => {
			if(!Board.Background.hasOwnProperty(props.background))
				throw new Error();
		},

		tickets: (props) => {
			if(!props.tickets instanceof immutable.List)
				throw new Error();
			props.tickets.forEach((ticket) => {
				if(!ticket instanceof Ticket)
					throw new Error();
				if(!ticket.position instanceof Ticket.Position)
					throw new Error();
			});
		}
	},

	getDefaultProps() {
		return { show: true }
	},

	shouldComponentUpdate(nextProps) {
		// If the map is not going to be shown, why bother updating it.
		if(!nextProps.show) return false;

		let prevProps = this.props;
		let havePropsChanged = (
			prevProps.background !== nextProps.background       ||
			!immutable.is(prevProps.size,    nextProps.size)    ||
			!immutable.is(prevProps.tickets, nextProps.tickets)
		);
		return havePropsChanged;
	},

	resizeCursor(screen) {
		// If the map is not shown, why bother updating the cursor size.
		if(!this.props.show) return null;

		let $this   = this.getDOMNode();
		let $cursor = this.refs.cursor.getDOMNode();

		let scale = {
			x: screen.width  / (this.props.size.width  * Ticket.Width),
			y: screen.height / (this.props.size.height * Ticket.Height),
		}

		$cursor.style.width  = Math.round(scale.x * $this.clientWidth);
		$cursor.style.height = Math.round(scale.y * $this.clientHeight);
	},

	render() {
		let classes = React.addons.classSet({
			minimap: true, hidden: !this.props.show,
		});

		// Recalculate the size of the minimap while retaining the aspect ratio
		// of the minimap, which is 'Ticket.Width / Ticket.Height'.

		let size = {
			width:  this.props.size.width  * Ticket.Width,
			height: this.props.size.height * Ticket.Height
		}

		let width   = Ticket.Width;
		let height  = (size.height / size.width) * width;
		let scaling = (height > width) ? (width / height) : 1.0;

		let image = Board.Background[this.props.background].url
			? `url(${Board.Background[this.props.background].url})`
			: '';

		let style = {
			width:           scaling * width,
			height:          scaling * height,
			backgroundImage: image
		}

		return (
			<div className={classes} style={style}>
				<div ref="cursor" className="cursor" />
				{this.renderMarkers(style.width / size.width)}
			</div>
		);
	},

	renderMarkers(scale) {
		return this.props.tickets.map(function(ticket) {
			return <Marker key={ticket.id} scale={scale} ticket={ticket} />;
		});
	}
});
