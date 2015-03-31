import React     from 'react';
import Draggable from 'draggabilly';

/**
 * Simple mixin that makes the component draggable inside it's parent.
 */
export default {
	getInitialState() {
		return { isDragging: false }
	},
	componentDidMount() {
		this.draggable = new Draggable(this.getDOMNode(), {
			containment: true
		});
		this.draggable.on('dragStart', (draggable, event) => {
			this.setState({ isDragging: true });
			return event.stopPropagation();
		});
		this.draggable.on('dragEnd', () => {
			this.setState({ isDragging: false });
		});
	},
	componentWillUnmount() {
		this.draggable = null;
	}
}
