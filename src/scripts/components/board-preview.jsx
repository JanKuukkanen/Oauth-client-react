'use strict';

var page  = require('page');
var React = require('react');

var Control           = require('../components/control');
var Minimap           = require('../components/minimap.jsx');
var EditBoardDialog   = require('../components/dialog/edit-board');
var RemoveBoardDialog = require('../components/dialog/remove-board');

var TicketStore   = require('../stores/ticket');
var TicketActions = require('../actions/ticket');

var markers  = require('../utils/create-markers');
var listener = require('../mixins/listener');
var Property = require('../constants/property');

/**
 * Preview component for Boards. Based on the 'Minimap' component.
 */
var BoardPreview = React.createClass({
	mixins: [
		listener(TicketStore),
	],

	propTypes: {
		board: Property.Board.isRequired,
	},

	getDefaultProps: function() {
		return {
			name:       '',
			background: '',
		}
	},

	getInitialState: function() {
		return {
			tickets: TicketStore.getTickets(this.props.board.id),
			showEditBoardDialog:   false,
			showRemoveBoardDialog: false,
		}
	},

	onChange: function() {
		this.setState({
			tickets: TicketStore.getTickets(this.props.board.id),
		});
	},

	componentDidMount: function() {
		return this._loadTickets();
	},

	componentDidUpdate: function(prev) {
		if(prev.board.id !== this.props.board.id) {
			// The 'id' changed, most likely to a clean one, so we need to
			// fetch the tickets associated with the clean board.
			return this._loadTickets();
		}
	},

	_loadTickets: function() {
		if(this.props.board.id.substring(0, 'dirty'.length) !== 'dirty') {
			return TicketActions.loadTickets(this.props.board.id);
		}
	},

	_showBoard: function() {
		return page.show('/boards/' + this.props.board.id + '');
	},

	_showEditBoardDialog: function() {
		return this.setState({
			showEditBoardDialog: !this.state.showEditBoardDialog
		});
	},

	_showRemoveBoardDialog: function() {
		return this.setState({
			showRemoveBoardDialog: !this.state.showRemoveBoardDialog
		});
	},

	render: function() {
		var editBoardDialog = !this.state.showEditBoardDialog ? null : (
			/* jshint ignore:start */
			<EditBoardDialog board={this.props.board} onDismiss={this._showEditBoardDialog} />
			/* jshint ignore:end */
		);
		var removeBoardDialog = !this.state.showRemoveBoardDialog ? null : (
			/* jshint ignore:start */
			<RemoveBoardDialog board={this.props.board} onDismiss={this._showRemoveBoardDialog} />
			/* jshint ignore:end */
		);
		return (
			/* jshint ignore:start */
			<div className="board-preview">
				<div className="minimap-container" onClick={this._showBoard}>
					<Minimap size={this.props.board.size} markers={markers(this.state.tickets)} />
				</div>
				<div className="name" onClick={this._showBoard}>
					{this.props.board.name}
				</div>
				{editBoardDialog}
				{removeBoardDialog}
				{this.renderControls()}
			</div>
			/* jshint ignore:end */
		);
	},

	renderControls: function() {
		var controls = [{
			icon:    'trash',
			active:  this.state.showRemoveBoardDialog,
			onClick: this._showRemoveBoardDialog,
		}, {
			icon:    'pencil',
			active:  this.state.showEditBoardDialog,
			onClick: this._showEditBoardDialog,
		}];
		return (
			/* jshint ignore:start */
			<div className="controls">
				{controls.map(function(ctrl, index) {
					return (
						<Control key={index} {...ctrl} />
					);
				})}
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = BoardPreview;
