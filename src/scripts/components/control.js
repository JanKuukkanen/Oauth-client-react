import React  from 'react/addons';
import Hammer from 'hammerjs';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.PureRenderMixin ],

	propTypes: {
		icon:    React.PropTypes.string.isRequired,
		active:  React.PropTypes.bool,
		onClick: React.PropTypes.func.isRequired,
	},

	getDefaultProps() {
		return { active: false }
	},

	componentDidMount() {
		new Hammer(this.getDOMNode()).on('tap', this.props.onClick);
	},

	render() {
		// console.debug('components/control::render');

		let controlClasses = React.addons.classSet({
			 control: true, active: this.props.active
		});
		let iconClasses = `fa fa-fw fa-${this.props.icon}`;

		return (
			<div className={controlClasses}>
				<span className={iconClasses}></span>
			</div>
		);
	}
});
