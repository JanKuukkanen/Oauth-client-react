'use strict';

var React = require('react/addons');

var Dialog = require('.');

var Property     = require('../../constants/property');
var BoardActions = require('../../actions/board');

/**
 * Displays an overlaid Dialog to edit the given Board.
 */
var EditBoardDialog = React.createClass({
	mixins: [ React.addons.LinkedStateMixin ],

	propTypes: {
		board:     Property.Board.isRequired,
		onDismiss: React.PropTypes.func.isRequired,
	},

	getInitialState: function() {
		return {
			name:       this.props.board.name,
			background: this.props.board.background,
		}
	},

	_submit: function() {
		BoardActions.editBoard(this.props.board.id, {
			name:       this.state.name,
			background: this.state.background,
		});
		return this.props.onDismiss();
	},

	_hide: function() {
		return BoardActions.revokeAccessCode(this.props.board.id);
	},

	_share: function() {
		return BoardActions.generateAccessCode(this.props.board.id);
	},

	render: function() {
		var id        = this.props.board.id;
		var code      = this.props.board.accessCode;
		var sharedURL = (code !== null && code.length > 0) ?
			location.host + '/boards/' + id + '/access/' + code + '' : '';

		var shareButton = sharedURL.length > 0 ? (
			/* jshint ignore:start */
			<button className="input btn-neutral" onClick={this._hide}>
				Hide
			</button>
			/* jshint ignore:end */
		) : (
			/* jshint ignore:start */
			<button className="input btn-secondary" onClick={this._share}>
				Share
			</button>
			/* jshint ignore:end */
		);
		return (
			/* jshint ignore:start */
			<Dialog className="dialog-edit-board" onDismiss={this.props.onDismiss}>
				<section className="dialog-header">
					Edit Board
				</section>
				<section className="dialog-content">
					<label htmlFor="board-name">Board Name</label>
					<input name="board-name" placeholder="Board Name" valueLink={this.linkState('name')} />

					<label htmlFor="board-share">Shared URL</label>
					<section className="input-group">
						<input name="board-share" placeholder="Shared URL" readOnly={true} value={sharedURL} />
						{shareButton}
					</section>

					<div className="background-select">
						<div className="value">
							<img src="http://www.placecage.com/c/256/256" />
						</div>
						<label htmlFor="board-background">Board Background</label>
						<div className="select">
							<select name="board-background">
								<option>None</option>
								<option>SWOT</option>
								<option>Business Shit</option>
							</select>
							<span className="caret fa fa-arrow-down"></span>
						</div>
					</div>

				</section>
				<section className="dialog-footer">
					<button className="btn-primary" onClick={this._submit}>
						Done
					</button>
				</section>
			</Dialog>
			/* jshint ignore:end */
		);
	}
});

module.exports = EditBoardDialog;
