import React	from 'react/addons';
import Carousel	from 'nuka-carousel';

import Dialog	from '../../components/dialog';

/**
 *
 */
export default React.createClass({

	componentDidMount() {
		let el = document.getElementById('application');

		el.className = 'info-view-active';

		// el.addClass('info-view-active')
	},

	componentWillUnmount() {
		let el = document.getElementById('application');

		// el.removeClass('info-view-active')
		el.className = '';
	},

	render() {
		return (
			<Dialog className="info" info
					onDismiss={this.props.onDismiss}>
				<Carousel className="infocarousel">
					<div className="slide1">
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