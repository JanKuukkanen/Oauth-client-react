import React	from 'react/addons';
import Carousel	from 'nuka-carousel';

import Dialog	from '../../components/dialog';

/**
 *
 */
export default React.createClass({
	mixins: [ Carousel.ControllerMixin ],

	componentDidMount() {
		this.el = document.getElementById('application');
		this.el.className = 'info-view-active';

		this.nav = document.getElementById('nav');
		this.nav.className = 'nav';
	},


	componentWillUnmount() {
		this.el.className = '';
		this.nav.className = 'nav';
	},

	componentDidUpdate(){

		this.el.className =
		`info-view-active slide-${this.state.carousels.carousel.state.currentSlide}`;

		this.nav.className =
		this.state.carousels.carousel.state.currentSlide === 1
		? 'nav user' : 'nav';
		
	},

	render() {

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
					<div className="slide"><p>Go Back</p></div>
					<div className="slide"><p>Go Back</p></div>
					<div className="slide"><p>Go Back</p></div>
					<div className="slide"><p>Go Back</p></div>
				</Carousel>
			</Dialog>
		);
	
	}
});