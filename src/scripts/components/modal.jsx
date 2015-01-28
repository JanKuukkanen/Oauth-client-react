'use strict';

var React  = require('react');
var Hammer = require('hammerjs');

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
		// Create a container for the actual modal content from 'this._render'
		// and render it into the DOM tree.
		this.target = document.createElement('div');
		this.props.container.appendChild(this.target);

		React.render(this._render(), this.target);

		// Make sure any clicks, taps and whatever on the 'overlay' trigger the
		// 'onDismiss' handler. Pointer events on the 'content' should not
		// trigger the 'onDismiss' handler.
		this.hammer = new Hammer(this.target.firstChild);

		this.hammer.on('tap', function(ev) {
			if(ev.target.className == 'modal-overlay') {
				return this.props.onDismiss();
			}
		}.bind(this));
	},

	componentWillUnmount: function () {
		React.unmountComponentAtNode(this.target);
		this.props.container.removeChild(this.target);

		this.hammer.destroy();
		this.hammer = null;
	},

	componentDidUpdate: function() {
		// Force updates on the child components.
		if(this.isMounted() && this.target) {
			React.render(this._render(), this.target);
		}
	},

	render: function() {
		return (
			<span className="modal-placeholder" />
		);
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
			<div className="modal-overlay" style={style.overlay}>
				<div className="modal-content" style={style.content}>
					{this.props.children}
				</div>
			</div>
		);
	}
});

module.exports = Modal;

