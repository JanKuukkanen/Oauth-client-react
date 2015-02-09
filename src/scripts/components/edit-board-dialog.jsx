'use strict';

var React            = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var Dialog = require('../components/dialog.jsx');

/**
 *
 */
var EditBoardDialog = React.createClass({
	mixins: [LinkedStateMixin],

	propTypes: {
		/**
		 * Initial state for the board we are editing.
		 */
		board: React.PropTypes.shape({
			id:         React.PropTypes.string.isRequired,
			name:       React.PropTypes.string.isRequired,
			background: React.PropTypes.string.isRequired,
		}).isRequired,

		/**
		 * Passed in to 'Dialog' as the 'onDismiss' callback.
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
	 *
	 */
	_submit: function() {
		// BoardActions.editBoard(this.props.board.id, this.state);
		return this.props.onDismiss();
	},

	/**
	 *
	 */
	_remove: function() {
		// BoardActions.removeBoard(this.props.board.id);
		return this.props.onDismiss();
	},

	render: function() {
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
