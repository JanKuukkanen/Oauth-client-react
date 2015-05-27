import React	from 'react/addons';
import Carousel	from 'nuka-carousel';
import Dropdown from '../dropdown';
import Dialog	from '../../components/dialog';

/**
 *
 */
export default React.createClass({
	mixins: [ Carousel.ControllerMixin ],

	getInitialState(){
		return { dropdown: true, currentSlide: null}
	},

	componentDidMount() {
		this.el = document.getElementById('application');
		this.el.className = 'info-view-active';

		this.avatar = document.getElementById('avatar');
		console.dir(avatar);
		//this.avatar.onClick() => null;
	},

	componentWillUnmount() {
		this.el.className = '';

	},

	componentDidUpdate(){
		this.state.currentSlide=this.state.carousels.carousel.state.currentSlide;
		this.el.className = `info-view-active slide-${this.state.currentSlide}`;
	},

	render() {

		let items = [
			{ icon: 'user',     content: 'Profile'  },
			{ icon: 'language', content: 'Localization'  },
			{ icon: 'bullhorn', content: 'Feedback'  },
			{ icon: 'sign-out', content: 'Logout'  }
		];
		return (
			<Dialog className="info" info
					onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="infocarousel"
					data={this.setCarouselData.bind(this, 'carousel')}>
					<div ref="firstSlide" className="slides slide1">

						<p>Go Back</p>
						<p>Edit board</p>
						<p>Share</p>
						<p>Export</p>
						<p>Magnet</p>
						<p>Minimap</p>
					</div>
					<div className="slides slide2">
						<Dropdown show={this.state.dropdown} items={items} />
					</div>
					<div className="slide"><p>Go Back</p></div>
					<div className="slide"><p>Go Back</p></div>
					<div className="slide"><p>Go Back</p></div>
					
				</Carousel>
			</Dialog>
		);
	
	}
});