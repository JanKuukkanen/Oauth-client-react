import React     from 'react/addons';
import immutable from 'immutable';

import Board  from '../models/board';
import Ticket from '../models/ticket';

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

	resizeCursor(screen) {
		if(this.props.show) {
			let $this   = this.getDOMNode();
			let $cursor = this.refs.cursor.getDOMNode();

			let scale = {
				x: screen.width  / (this.props.size.width  * Ticket.Width),
				y: screen.height / (this.props.size.height * Ticket.Height),
			}

			$cursor.style.width  = Math.round(scale.x * $this.clientWidth);
			$cursor.style.height = Math.round(scale.y * $this.clientHeight);
		}
	},

	render() {
		let classes = React.addons.classSet({
			minimap: true, hidden: !this.props.show,
		});

		// Calculate the size of the minimap while retaining the aspect ratio.

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

	/**
	 * Render the 'this.props.markers'.
	 *
	 * @param {number} scale  Defines the scaling factor for the marker's size
	 *                        and position, when placed on the minimap.
	 */
	renderMarkers(scale) {
		return this.props.tickets.map(function(ticket) {
			let style = {
				top:  Math.round(scale * ticket.position.y),
				left: Math.round(scale * ticket.position.x),

				width:  Math.round(scale * Ticket.Width),
				height: Math.round(scale * Ticket.Height),

				zIndex:          ticket.position.z,
				backgroundColor: ticket.color,
			}
			return (
				<div key={ticket.id} className="marker" style={style} />
			);
		});
	}
});
