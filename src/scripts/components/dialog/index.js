'use strict';

var React  = require('react');
var Hammer = require('hammerjs');

/**
 * Dialog can be used to wrap and display content above other stuff in a
 * fashionable manner.
 */
var Dialog = React.createClass({
	propTypes: {
		/**
		 * Used to specify an additional 'className' for the '.dialog'.
		 */
		className: React.PropTypes.string,

		/**
		 * The 'onDismiss' callback is invoked when the overlay is clicked.
		 */
		onDismiss: React.PropTypes.func,

		/**
	     * The 'container' is the DOM element the actual Dialog is mounted on.
	     * Defaults to 'document.body' so you don't usually need to pass in a
	     * separate container.
	     */
		container: function(props) {
			if(!(props.container instanceof Element)) {
				return new Error('container must be an Element');
			}
		},
	},

	getDefaultProps: function() {
		return {
			container: document.body,
			className: '',
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
		this.hammer.on('tap', function dismiss(ev) {
			if(ev.target.className === 'dialog-overlay') {
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

	/**
	 * Returns the actual Dialog component DOM representation.
	 */
	_render: function() {
		var classes = 'dialog' + (this.props.className ?
			(' ' + this.props.className + '') : '');
		return (
			/* jshint ignore:start */
			<div className="dialog-overlay">
				<div className={classes}>{this.props.children}</div>
			</div>
			/* jshint ignore:end */
		);
	},

	render: function() {
		return (
			/* jshint ignore:start */
			<span className="dialog-placeholder" />
			/* jshint ignore:end */
		);
	},
});

module.exports = Dialog;

