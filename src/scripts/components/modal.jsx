'use strict';

var React  = require('react');
var Hammer = require('hammerjs');

/**
 * Modal can be used to wrap and display content above other stuff in a
 * fashionable manner.
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
			if(ev.target.className === 'modal-overlay') {
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
			/* jshint ignore:start */
			<span className="modal-placeholder" />
			/* jshint ignore:end */
		);
	},

	/**
	 * Returns the actual Modal component DOM representation.
	 */
	_render: function() {
		return (
			/* jshint ignore:start */
			<div className="modal-overlay">
				<div className="modal-content">
					{this.props.children}
				</div>
			</div>
			/* jshint ignore:end */
		);
	}
});

module.exports = Modal;

