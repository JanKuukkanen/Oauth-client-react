'use strict';

var React = require('react');

/**
 *
 */
var Item = React.createClass({
	propTypes: {
		icon:     React.PropTypes.string.isRequired,
		onClick:  React.PropTypes.func,
		disabled: React.PropTypes.bool,
	},

	getDefaultProps: function() {
		return {
			onClick:  function() {},
			disabled: false,
		}
	},

	render: function() {
		var itemClasses = React.addons.classSet({
			item:     true,
			disabled: this.props.disabled,
		});
		var iconClasses = 'fa fa-fw fa-' + this.props.icon + '';

		return (
			/* jshint ignore:start */
			<li className={itemClasses} onClick={this.props.onClick}>
				<span className={iconClasses}></span>
				{this.props.content}
			</li>
			/* jshint ignore:end */
		);
	}
});

/**
 *
 */
module.exports = React.createClass({
	propTypes: {
		show:  React.PropTypes.bool.isRequired,
		items: React.PropTypes.arrayOf(React.PropTypes.shape(Item.propTypes)),
	},

	getDefaultProps: function() {
		return { items: [ ] }
	},

	render: function() {
		return !this.props.show ? null : (
			/* jshint ignore:start */
			<ul className="dropdown">
				{this.renderItems()}
			</ul>
			/* jshint ignore:end */
		);
	},

	renderItems: function() {
		return this.props.items.map(function(item, index) {
			return (
				/* jshint ignore:start */
				<Item key={index} {...item} />
				/* jshint ignore:end */
			);
		});
	}
});
