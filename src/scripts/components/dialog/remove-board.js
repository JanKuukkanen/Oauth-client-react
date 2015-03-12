'use strict';

var React = require('react/addons');

var Dialog = require('.');

var Property     = require('../../constants/property');
var BoardActions = require('../../actions/board');

/**
 * Displays an overlaid Dialog to edit the given Board.
 */
var RemoveBoardDialog = React.createClass({
	mixins: [ React.addons.LinkedStateMixin ],

	propTypes: {
		board:     Property.Board.isRequired,
		onDismiss: React.PropTypes.func.isRequired,
	},

	_cancel: function() {
		return this.props.onDismiss();
	},

	_remove: function() {
		BoardActions.removeBoard(this.props.board.id);
		return this.props.onDismiss();
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<Dialog className="dialog-remove-board" onDismiss={this.props.onDismiss}>
				<section className="dialog-header">
					Remove Board
				</section>
				<section className="dialog-content">
					<p>
						Are you sure you want to remove <strong>{this.props.board.name}</strong>?
					</p>
				</section>
				<section className="dialog-footer">
					<button className="btn-neutral" onClick={this._cancel}>
						Cancel
					</button>
					<button className="btn-danger" onClick={this._remove}>
						Remove
					</button>
				</section>
			</Dialog>
			/* jshint ignore:end */
		);
	}
});

module.exports = RemoveBoardDialog;
