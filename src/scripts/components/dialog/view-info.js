import React		from 'react/addons';
import Carousel		from 'nuka-carousel';
import Dialog		from '../../components/dialog';
import TextBoxes	from './text-box';
import Dropdown 	from '../dropdown';

/**
 *
 */
export default React.createClass({
	mixins: [ Carousel.ControllerMixin ],
	getInitialState(){
		return {currentSlide: null}
	},

	componentDidMount() {
		this.el = document.getElementById('application');
		this.el.className = 'info-view-active';
		this.avatar = document.getElementById('avatar');
	},

	componentWillUnmount() {
		this.el.className = '';
	},

	componentDidUpdate(){
		this.el.className = 
		`info-view-active slide-${this.state.carousels.carousel.state.currentSlide}`;
	},

	render() {
		let currentSlide;
		currentSlide = !this.state.carousels.carousel ? 0 
		: this.state.carousels.carousel.state.currentSlide;

		let boxes = {
			eka :[ 
				{ title: 'Back', content: 'Return to workspace', class: 'pos-back' },
			 	{ title: 'Edit Board', 	content: 'Edit board', class:'pos-edit' },
			 	{ title: 'Share Board', 	content: 'Share board', class:'pos-share' },
			 	{ title: 'Export Board', 	content: 'Export board yo', class:'pos-export' },
			 	{ title: 'Magnet', 	content: 'Mag', class:'pos-magnet' },
			 	{ title: 'Gridify', 	content: 'Toggle board overview and navigate', class:'pos-minimap' },
			 	{ title: 'Profile', 	content: 'Edit your profile man', class:'pos-profile' },
			 	{ title: 'Localization', 	content: 'legalize0 man', class:'pos-localization' },
			 	{ title: 'Feedback', 	content: 'Send feedback', class:'pos-feedback' },
			 	{ title: 'Logout', 	content: 'Mag bigmäg yo män', class:'pos-logout' }
			 	],
		 	toka :
				[{ title: 'Back', content: 'Here is the back button', class: 'pos-back' },
			 	{ title: 'Edit Board', 	content: 'Edit board', class:'pos-edit' }]
		};

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
			<Dialog className="info" info
					onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="infocarousel"
					data={this.setCarouselData.bind(this, 'carousel')}>
					<div>
						<TextBoxes items={boxes.eka} objects={objects[0]}/>
					</div>
					<div>
						<TextBoxes items={boxes.toka} objects={objects[1]}/>
					</div>
					<div>
						<TextBoxes items={boxes.toka} objects={objects[2]}/>
					</div>
					<div>
						<TextBoxes items={boxes.toka} objects={objects[3]}/>
					</div>
					<div>
						<TextBoxes items={boxes.toka} objects={objects[4]}/>
					</div>
					
				</Carousel>
			</Dialog>
		);
	
	}
});