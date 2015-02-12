'use strict';

var page  = require('page');
var React = require('react');

var Minimap         = require('../components/minimap.jsx');
var EditBoardDialog = require('../components/edit-board-dialog.jsx');

var TicketStore   = require('../stores/ticket');
var TicketActions = require('../actions/ticket');

var props     = require('../constants/props');
var markers   = require('../utils/create-markers');
var listener  = require('../mixins/listener');

/**
 * Preview component for Boards. Based on the 'Minimap' component.
 */
var BoardPreview = React.createClass({
	mixins: [
		listener(TicketStore),
	],

	propTypes: {
		/**
		 * The board being previewed.
		 */
		board: props.Board.isRequired,
	},

	getDefaultProps: function() {
		return {
			name:       '',
			background: '',
		}
	},

	getInitialState: function() {
		return {
			tickets:   TicketStore.getTickets(this.props.board.id),
			isEditing: false,
		}
	},

	onChange: function() {
		this.setState({
			tickets: TicketStore.getTickets(this.props.board.id),
		});
	},

	componentDidMount: function() {
		TicketActions.loadTickets(this.props.board.id);
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
		if(this.state.isEditing) {
			var editBoardDialog = (
				/* jshint ignore:start */
				<EditBoardDialog board={this.props.board}
					onDismiss={this._toggleEdit} />
				/* jshint ignore:end */
			);
		}
		return (
			/* jshint ignore:start */
			<div className="board-preview">
				<div className="minimap-container" onClick={this._navigate}>
					<Minimap show={true} area={this.props.board.size}
						markers={markers(this.state.tickets)} />
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
