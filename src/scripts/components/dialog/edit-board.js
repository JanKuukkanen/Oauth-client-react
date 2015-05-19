import React from 'react/addons';

import Board       from '../../models/board';
import BoardAction from '../../actions/board';

import Dialog           from '../../components/dialog';
import BackgroundSelect from '../../components/background-select';

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

	getInitialState() {
		return {
			name:             this.props.board.name,
			background:       this.props.board.background,
			customBackground: this.props.board.customBackground
		}
	},

	submit(event) {
		event.preventDefault();

		BoardAction.update({
			id:               this.props.board.id,
			name:             this.state.name,
			background:       this.state.background,
			customBackground: this.state.customBackground
		});
		return this.props.onDismiss();
	},

	render() {
		return (
			<Dialog className="dialog-edit-board"
					onDismiss={this.props.onDismiss}>
				<section className="dialog-header">
					Edit Board
				</section>
				<section className="dialog-content">

					<label htmlFor="board-name">Board Name</label>
					<input name="board-name" placeholder="Board Name"
						valueLink={this.linkState('name')} autoFocus={true} />

					<BackgroundSelect background={this.linkState('background')}
						customBackground={this.linkState('customBackground')} />
				</section>
				<section className="dialog-footer">
					<button className="btn-primary" onClick={this.submit}>
						Done
					</button>
				</section>
			</Dialog>
		);
	}
});
