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



	//	console.table(this.state);//.carousel

	},


	componentWillUnmount() {
		this.el.className = '';
	},

	componentDidUpdate(){

		this.el.className =
		this.state.carousels.carousel.state.currentSlide === 0
		? 'info-view-active info-view-slide-1' : '';
		
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