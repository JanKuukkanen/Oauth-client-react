import React from 'react/addons';

import Board       from '../../models/board';
import BoardAction from '../../actions/board';

import Dialog from '../../components/dialog';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.PureRenderMixin, React.addons.LinkedStateMixin ],

	propTypes: {
		board: (props) => {
			if(!props.board instanceof Board) throw new Error();
		},
		onDismiss: React.PropTypes.func.isRequired
	},

	remove() {
		BoardAction.delete(this.props.board);
		return this.props.onDismiss();
	},

	render() {
		let remove  = this.remove;
		let dismiss = this.props.onDismiss;

		let content = !this.props.board.name
			? 'this board'
			: <strong>{this.props.board.name}</strong>;

		return (
			<Dialog className="dialog-remove-board" onDismiss={dismiss}>
				<section className="dialog-header">
					Remove Board
				</section>
				<section className="dialog-content">
					<p>Are you sure you want to remove {content}?</p>
				</section>
				<section className="dialog-footer">
					<button className="btn-neutral" onClick={dismiss}>
						Cancel
					</button>
					<button className="btn-danger" onClick={remove}>
						Remove
					</button>
				</section>
			</Dialog>
		);
	}
});
