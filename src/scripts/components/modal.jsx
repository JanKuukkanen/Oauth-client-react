'use strict';

var React = require('react');

/**
 * Modal can be used to wrap and display content above other stuff in a
 * fashionable manner.
 *
 * Sample usage:
 *
 * <Modal>
 *   <MyComponent />
 *   <MyOtherComponent>
 *     <div className="my-component-thing" />
 *   </MyOtherComponent>
 * </Modal>
 */
var Modal = React.createClass({

	propTypes: {
	    /**
	     * The 'container' is the DOM element the actual Modal is mounted on.
	     * Defaults to 'document.body' so you don't usually need to pass in a
	     * separate container.
	     */
	    container: function(props) {
	    	if(!(props.container instanceof Element)) {
	    		return new Error('container must be an Element');
	    	}
		},

		/**
		 * The 'onDismiss' callback is invoked when the overlay is clicked.
		 */
		onDismiss: React.PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			container: document.body,
			onDismiss: function() {},
		}
	},

	componentDidMount: function() {
		this.target = document.createElement('div');
		this.props.container.appendChild(this.target);

		React.render(this._render(), this.target);
	},

	componentWillUnmount: function () {
		React.unmountComponentAtNode(this.target);
		this.props.container.removeChild(this.target);
	},

	render: function() {
		return (
			<span className="modal-placeholder" />
		);
	},

	/**
	 * Makes sure the event from clicking the content does not also trigger the
	 * event for clicking the overlay.
	 */
	_stopPropagation: function(event) {
		return event.stopPropagation();
	},

	/**
	 * Returns the actual Modal component DOM representation.
	 */
	_render: function() {
		var style = {
			overlay: {
				top:      '0',
				left:     '0',
				width:    '100%',
				height:   '100%',
				position: 'fixed',
			},
			content: {
				top:      '50%',
				left:     '50%',
				width:    '50%',
				height:   '50%',
				margin:   '-25% 0 0 -25%',
				position: 'fixed',
			}
		}
		return (
			<div className="modal-overlay" style={style.overlay}
					onClick={this.props.onDismiss}>
				<div className="modal-content" style={style.content}
						onClick={this._stopPropagation}>
					{this.props.children}
				</div>
			</div>
		);
	}
});

module.exports = Modal;

