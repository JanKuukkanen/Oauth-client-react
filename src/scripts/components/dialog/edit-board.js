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

		let size = {
			"width": this.state.width,
			"height": this.state.height
		};


		if (!isNaN(size.width) && !isNaN(size.height)) {

			if (size.width < 1 || size.height < 1) {
				size.width = this.props.board.size.width;
				size.height = this.props.board.size.height;
			}

			BoardAction.update({
				id: this.props.board.id,
				name: this.state.name,
				background: this.state.background,
				customBackground: this.state.customBackground,
				size: size
			});
		}
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
						customBackground={this.linkState('customBackground')}
						board={this.props.board}/>

					<label htmlFor="dialog-size-wrapper">Board size (measured in tickets)</label>
					<section className="dialog-size-wrapper">
						<section className="dialog-size">
								<label htmlFor="board-width">Width</label>
								<input name="board-width"
                                       placeholder="Board Width"
                                       valueLink={this.linkState('width')}
                                       type="number" min="1" />
						</section>

						<section className="times-wrapper">
							<i className="fa fa-times"></i>
						</section>

						<section className="dialog-size">
							<label htmlFor="board-height">Height</label>
								<input name="board-height"
                                       placeholder="Board Height"
                                       valueLink={this.linkState('height')}
                                       type="number" min="1"/>
						</section>
                </section>

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
