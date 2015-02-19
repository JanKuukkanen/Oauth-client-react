'use strict';

var React            = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var Dialog = require('../components/dialog.jsx');

var props        = require('../constants/props');
var BoardActions = require('../actions/board');

/**
 * Displays an overlaid Dialog to edit the given Board.
 */
var EditBoardDialog = React.createClass({
	mixins: [LinkedStateMixin],

	propTypes: {
		/**
		 * Initial state of the board.
		 */
		board: props.Board.isRequired,

		/**
		 * Callback for dialog dismissal.
		 */
		onDismiss: React.PropTypes.func.isRequired,
	},

	getInitialState: function() {
		return {
			name:       this.props.board.name,
			background: this.props.board.background,
		}
	},

	/**
	 * Triggers persisting the edits.
	 */
	_submit: function() {
		BoardActions.editBoard(this.props.board.id, {
			name:       this.state.name,
			background: this.state.background,
		});
		return this.props.onDismiss();
	},

	/**
	 * Triggers the removal of the board.
	 */
	_remove: function() {
		BoardActions.removeBoard(this.props.board.id);
		return this.props.onDismiss();
	},

	/**
	 *
	 */
	_generateAccessCode: function() {
		return BoardActions.generateAccessCode(this.props.board.id);
	},

	/**
	 *
	 */
	_revokeAccessCode: function() {
		return BoardActions.revokeAccessCode(this.props.board.id);
	},

	render: function() {
		var shareButton = (
			/* jshint ignore:start */
			<button className="btn turquoise"
					onClick={this._generateAccessCode}>
				Share
			</button>
			/* jshint ignore:end */
		);
		var code = this.props.board.accessCode;
		if(code !== null && code.length > 0) {
			shareButton = (
				/* jshint ignore:start */
				<button className="btn red"
						onClick={this._revokeAccessCode}>
					Hide
				</button>
				/* jshint ignore:end */
			);
		}
		return (
			/* jshint ignore:start */
			<Dialog className="edit-board-dialog"
					onDismiss={this.props.onDismiss}>
				<div className="title">
					Edit Board
				</div>
				<div className="form">
					<input type="text" placeholder="Name"
						valueLink={this.linkState('name')} />
					<input type="text" placeholder="Background URL"
						valueLink={this.linkState('background')} />
					<div className="share">
						<input type="text" readOnly={true}
								value={this.props.board.accessCode} />
						{shareButton}
					</div>
				</div>
				<div className="controls">
					<button className="btn turquoise" onClick={this._submit}>
						Done
					</button>
					<button className="btn red" onClick={this._remove}>
						Delete
					</button>
				</div>
			</Dialog>
			/* jshint ignore:end */
		);
	}
});

module.exports = EditBoardDialog;
