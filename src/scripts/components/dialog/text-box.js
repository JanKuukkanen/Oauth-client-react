import React from 'react';

/**
 *
 */
 
const SingleBox = React.createClass({
	propTypes: {
		content: React.PropTypes.string,
		className:  React.PropTypes.string
	},

	getDefaultProps() {
		return {
			content: 'Content',
			className: ''
		}
	},

	render() {
		return (
			<div className={`pos ${this.props.className}`}>
				<p>{this.props.content}</p>
			</div>
		);
	}
});

export default React.createClass({
	propTypes: {
		items: React.PropTypes.array,
		objects: React.PropTypes.array
	},

	getDefaultProps() {
		return { items: [ ], objects: [ ] }
	},

	render() {
		return (
			<div className="infospace">
				{this.props.objects}
				{this.props.items.map((item, index) => {
					return <SingleBox key={index} {...item} />;
				})}
			</div>
		);
	}
});
