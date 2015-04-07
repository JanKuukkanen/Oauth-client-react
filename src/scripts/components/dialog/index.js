import React  from 'react/addons';
import Hammer from 'hammerjs';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.PureRenderMixin ],

	propTypes: {
		className: React.PropTypes.string,
		onDismiss: React.PropTypes.func
	},

	getDefaultProps() {
		return {
			className: '',
			onDismiss: () => {},
		}
	},

	componentDidMount() {
		// Create a container for the actual modal content from 'renderDialog'
		// and render it into the DOM tree.
		this.target = document.body.appendChild(document.createElement('div'));
		React.render(this.renderDialog(), this.target);

		// Make sure any clicks, taps and whatever on the 'overlay' trigger the
		// 'onDismiss' handler. Pointer events on the 'content' should not
		// trigger the 'onDismiss' handler.
		this.hammer = new Hammer(this.target.firstChild);
		this.hammer.on('tap', (event) => {
			if(event.target.className === 'dialog-overlay') {
				return this.props.onDismiss();
			}
		});
	},

	componentWillUnmount() {
		React.unmountComponentAtNode(this.target);
		document.body.removeChild(this.target);
	},

	componentDidUpdate() {
		if(this.isMounted() && this.target) {
			React.render(this.renderDialog(), this.target);
		}
	},

	onSubmit(event) {
		return event.preventDefault();
	},

	render() {
		return (
			<span className="dialog-placeholder" />
		);
	},

	renderDialog() {
		return (
			<div className="dialog-overlay">
				<form className={`dialog ${this.props.className}`}
						onSubmit={this.onSubmit}>
					{this.props.children}
				</form>
			</div>
		);
	}
});
