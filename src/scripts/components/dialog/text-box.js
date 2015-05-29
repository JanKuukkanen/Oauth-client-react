import React from 'react/addons';
import Dropdown 	from '../dropdown';
/**
 *
 */
const SingleBox = React.createClass({
	propTypes: {
		title: React.PropTypes.string,
		content: React.PropTypes.string,
		class:  React.PropTypes.string
	},

	getDefaultProps() {
		return {
			title: 'Title',
			content: 'Content',
			class: ''
		}
	},

	render() {
		return (
			<div className={`pos ${this.props.class}`}>
				<section className="dialog-header">
					{this.props.title}
				</section>
				<p>{this.props.content}</p>
			</div>
		);
	}

});

export default React.createClass({
	propTypes: {
		items: React.PropTypes.array,
		currentSlide: React.PropTypes.number.isRequired
	},

	getDefaultProps() {
		return { items: [ ], currentSlide: 0}
	},

	render() {
		let dropitems = [
			{ icon: 'user',     content: 'Profile'  },
			{ icon: 'language', content: 'Localization'  },
			{ icon: 'bullhorn', content: 'Feedback'  },
			{ icon: 'sign-out', content: 'Logout'  }
		];

		let objects = [
			[<Dropdown class='infodrop' show={true} items={dropitems} />, 'hejsan'], 
		 	['asd', ' dsadsa'], 
			['asd', ' dsadsa'], 
			['asd', ' dsadsa'], 
			['asd', ' dsadsa']
		 ];

		return (

			<div className="infospace">
				{objects[this.props.currentSlide].map((item, index) => {
					return item;
				})}
				{this.props.items.map((item, index) => {
					return <SingleBox key={index} {...item} />;
				})}


			</div>
		);
	}
});