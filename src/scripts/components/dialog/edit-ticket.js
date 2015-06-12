import React     from 'react/addons';
import immutable from 'immutable';

import Ticket       from '../../models/ticket';
import TicketAction from '../../actions/ticket';

import Dialog      from '../../components/dialog';
import ColorSelect from '../../components/color-select';

import markdown   from 'markdown';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.LinkedStateMixin ],

	propTypes: {
		ticket: (props) => {
			if(!props.ticket instanceof Ticket) throw new Error();
		},
		board:     React.PropTypes.string.isRequired,
		onDismiss: React.PropTypes.func.isRequired
	},

	getInitialState() {
		return {
			color:   this.props.ticket.color,
			content: this.props.ticket.content,
			isEditing: this.props.ticket.content === ''
		}
	},

	remove(event) {
		event.preventDefault();
		TicketAction.delete({ id: this.props.board }, {
			id: this.props.ticket.id
		});
		return this.props.onDismiss();
	},

	update(event) {
		event.preventDefault();
		TicketAction.update({ id: this.props.board }, {
			id:      this.props.ticket.id,
			color:   this.state.color,
			content: this.state.content
		});
		return this.props.onDismiss();
	},

	toggleEdit(event) {
		// This handler is a no-op if we are clicking on the text-area.
		if(event.target instanceof HTMLTextAreaElement) return;

		this.setState({ isEditing: !this.state.isEditing });
		return event.stopPropagation();
	},

	render() {
		let editDialogContent  = null;

		if (!this.state.isEditing) {
			let content = this.state.content;
			let markupContent = markdown.markdown.toHTML(content);

			// Add target="_blank" attribute to links
			if (markupContent.includes('<a href=')) {
				markupContent = markupContent.replace(/<a href="/g, '<a target="_blank" href="');
			}
			editDialogContent = <span dangerouslySetInnerHTML={{__html: markupContent}}
									  onClick={this.toggleEdit} />
		}

		else if(this.state.isEditing) {
			editDialogContent = <textarea valueLink={this.linkState('content')}
													 tabIndex={1} autoFocus={true} />
		}

		return (
			<Dialog className="edit-ticket-dialog"
					onDismiss={this.props.onDismiss}>
				<section className="dialog-header">
					<ColorSelect color={this.linkState('color')} />
				</section>
				<section onClick={this.state.isEditing ? this.toggleEdit : null}>
						<section className="dialog-content">
							{editDialogContent}
						</section>
						<section className="dialog-footer">
							<button className="btn-danger" onClick={this.remove}
									tabIndex={3}>
								Delete
							</button>
							<button className="btn-primary" onClick={this.update}
									tabIndex={2}>
								Done
							</button>
						</section>
					</section>
			</Dialog>
		);
	}
});
