import React from 'react';

const DropdownItem = React.createClass({
	propTypes: {
		icon:     React.PropTypes.string,
		onClick:  React.PropTypes.func,
		disabled: React.PropTypes.bool
	},

	getDefaultProps() {
		return {
			onClick:  () => {},
			disabled: false,
		}
	},

	render() {
		let itemClasses = React.addons.classSet({
			item:     true,
			disabled: this.props.disabled
		});
		let icon = !this.props.icon ? null : (
			<span className={`fa fa-fw fa-${this.props.icon}`} />
		);
		return (
			<li className={itemClasses} onClick={this.props.onClick}>
				{icon}{this.props.content}
			</li>
		);
	}

});

export default React.createClass({
	propTypes: {
		show:  React.PropTypes.bool.isRequired,
		items: React.PropTypes.array
	},

	getDefaultProps() {
		return { items: [ ] }
	},

	render() {
		return !this.props.show ? null : (
			<ul className="dropdown">
				{this.props.items.map((item, index) => {
					return <DropdownItem key={index} {...item} />;
				})}
			</ul>
		);
	}
});
