'use strict';

var page  = require('page');
var React = require('react');

var Minimap         = require('../components/minimap.jsx');
var EditBoardDialog = require('../components/edit-board-dialog.jsx');

var TICKET_WIDTH  = require('../constants').TICKET_WIDTH;
var TICKET_HEIGHT = require('../constants').TICKET_HEIGHT;
var MINIMAP_MAX   = require('../constants').MINIMAP_MAX;

var BoardPreview = React.createClass({
	propTypes: {
		/**
		 *
		 */
		board: React.PropTypes.shape({
			/**
			 *
			 */
			size: React.PropTypes.shape({
				width:  React.PropTypes.number,
				height: React.PropTypes.number,
			}).isRequired,

			/**
			 *
			 */
			name: React.PropTypes.string,

			/**
			 *
			 */
			background: React.PropTypes.string,
		}).isRequired,
	},

	getDefaultProps: function() {
		return {
			name:      '',
			background: '',
		}
	},

	getInitialState: function() {
		return {
			isEditing: false,
		}
	},

	/**
	 * Navigate to the corresponding BoardView.
	 */
	_navigate: function() {
		return page.show('/boards/' + this._currentElement.key + '');
	},

	/**
	 * Toggles the 'isEditing' state. Practically showing or hiding the dialog
	 * for editing the board.
	 */
	_toggleEdit: function() {
		return this.setState({ isEditing: !this.state.isEditing });
	},

	render: function() {
		var board = {
			id:         this._currentElement.key,
			name:       this.props.board.name,
			background: this.props.board.background,
		}
		if(this.state.isEditing) {
			var editBoardDialog = (
				/* jshint ignore:start */
				<EditBoardDialog board={board} onDismiss={this._toggleEdit} />
				/* jshint ignore:end */
			);
		}
		return (
			/* jshint ignore:start */
			<div className="board-preview">
				<div className="minimap-container" onClick={this._navigate}>
					<Minimap show={true} area={this.props.board.size} />
				</div>
				<div className="controls" onClick={this._toggleEdit}>
					<span className="name">
						{this.props.board.name}
					</span>
					<i className="fa fa-lg fa-pencil" />
				</div>
				{editBoardDialog}
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = BoardPreview;
