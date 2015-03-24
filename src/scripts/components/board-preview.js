import page  from 'page';
import React from 'react';

import Board        from '../models/board';
import BoardStore   from '../stores/board';
import TicketAction from '../actions/ticket';

import Control           from '../components/control';
import Minimap           from '../components/minimap';
import EditBoardDialog   from '../components/dialog/edit-board';
import RemoveBoardDialog from '../components/dialog/remove-board';

/**
 *
 */
export default React.createClass({
	propTypes: {
		board: (props) => {
			if(!props.board instanceof Board) throw Error();
		},
	},

	getInitialState() {
		return {
			showEditBoardDialog:   false,
			showRemoveBoardDialog: false,
		}
	},

	componentDidMount() {
		// console.debug('components/board-preview::componentDidMount');
	},


	componentDidUpdate() {
		// console.debug('components/board-preview::componentDidUpdate');
	},

	showBoard() {
		return page.show(`/boards/${this.props.board.id}`);
	},

	showDialog(dialog) {
		this.setState({ [`show${dialog}`]: !this.state[`show${dialog}`] });
	},

	render() {
		// console.debug('components/board-preview::render');

		let board = this.props.board;

		let editBoardDialog = !this.state.showEditBoardDialog ? null : (
			<EditBoardDialog board={board}
				onDismiss={this.showDialog.bind(this, 'EditBoardDialog')} />
		);
		let removeBoardDialog = !this.state.showRemoveBoardDialog ? null : (
			<RemoveBoardDialog board={board}
				onDismiss={this.showDialog.bind(this, 'RemoveBoardDialog')} />
		);

		return (
			<div className="board-preview">
				<div className="minimap-container" onClick={this.showBoard}>
					<Minimap size={board.size} background={board.background}
						tickets={board.tickets} />
				</div>
				<div className="name" onClick={this.showBoard}>
					{board.name}
				</div>
				{editBoardDialog}
				{removeBoardDialog}
				{this.renderControls()}
			</div>
		);
	},

	renderControls() {
		// console.debug('components/board-preview::renderControls');

		let controls = [{
			icon:    'trash',
			active:  this.state.showRemoveBoardDialog,
			onClick: this.showDialog.bind(this, 'RemoveBoardDialog')
		}, {
			icon:    'pencil',
			active:  this.state.showEditBoardDialog,
			onClick: this.showDialog.bind(this, 'EditBoardDialog')
		}];

		return (
			<div className="controls">
				{controls.map(function(ctrl, index) {
					return <Control key={index} {...ctrl} />;
				})}
			</div>
		);
	}
});
