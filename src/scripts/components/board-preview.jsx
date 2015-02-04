'use strict';

var page  = require('page');
var React = require('react');

var TICKET_WIDTH  = require('../constants').TICKET_WIDTH;
var TICKET_HEIGHT = require('../constants').TICKET_HEIGHT;
var MINIMAP_MAX   = require('../constants').MINIMAP_MAX;

var BoardPreview = React.createClass({
	propTypes: {
		/**
		 *
		 */
		size: React.PropTypes.shape({
			width:  React.PropTypes.number,
			height: React.PropTypes.number,
		}),

		/**
		 *
		 */
		title: React.PropTypes.string,

		/**
		 *
		 */
		background: React.PropTypes.string,

	},

	_showBoard: function() {
		return page.show('/boards/' + this._currentElement.key + '');
	},

	render: function() {
		// We perform the same calculation as we did with the Scrollable's map,
		// in which we clamp the board's size to the MINIMAP_MAX while
		// retaining the original aspect ratio...
		var size   = this.props.size;
		var height = (size.height / size.width) * MINIMAP_MAX;
		var scale  = (height > MINIMAP_MAX) ? MINIMAP_MAX / height : 1;

		var styles = {
			container: {
				width:  MINIMAP_MAX,
				height: MINIMAP_MAX,
			},
			board: {
				width:  scale * MINIMAP_MAX,
				height: scale * height,
			},
		}
		return (
			<div className="board-preview" onClick={this._showBoard}>
				<div className="preview" style={styles.container}>
					<div className="board" style={styles.board} />
				</div>
				<div className="footer">
					<div className="title">
						{this.props.title}
					</div>
				</div>
			</div>
		);
	}

});

module.exports = BoardPreview;
