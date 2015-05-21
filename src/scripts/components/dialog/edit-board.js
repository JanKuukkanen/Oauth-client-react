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
			customBackground: this.props.board.customBackground,
			width:            this.props.board.size.width,
			height:           this.props.board.size.height
		}
	},

	submit(event) {
		event.preventDefault();

		let size = {"width":  this.state.width,
			        "height": this.state.height};

		BoardAction.update({
			id:               this.props.board.id,
			name:             this.state.name,
			background:       this.state.background,
			customBackground: this.state.customBackground,
			size:             size
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

					<label htmlFor="board-width">Board Width</label>
					<input name="board-width" placeholder="Board Width"
						   valueLink={this.linkState('width')}
						   type="number" min="1" />

					<label htmlFor="board-height">Board Length</label>
					<input name="board-height" placeholder="Board Length"
						   valueLink={this.linkState('height')}
						   type="number" min="1" />

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
