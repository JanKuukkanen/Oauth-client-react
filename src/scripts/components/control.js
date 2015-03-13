'use strict';

var React  = require('react/addons');
var Hammer = require('hammerjs');

/**
 * Very simple Toggle component, that displays a single FontAwesome icon.
 */
module.exports = React.createClass({
	propTypes: {
		icon:    React.PropTypes.string.isRequired,
		active:  React.PropTypes.bool,
		onClick: React.PropTypes.func.isRequired,
	},

	getDefaultProps: function() {
		return { active: false }
	},

	componentDidMount: function() {
		new Hammer(this.getDOMNode()).on('tap', this.props.onClick);
	},

	render: function() {
		var controlClasses = React.addons.classSet({
			active:  this.props.active,
			control: true,
		});

		var iconClasses = 'fa fa-fw fa-' + this.props.icon + '';

		return (
			/* jshint ignore:start */
			<div className={controlClasses}>
				<span className={iconClasses}></span>
			</div>
			/* jshint ignore:end */
		);
	}
});
