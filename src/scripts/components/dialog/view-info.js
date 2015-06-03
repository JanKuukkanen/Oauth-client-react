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
		return { currentSlide: null }
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
		`info-view-active slide-${this.state.carousels.carousel.state
			.currentSlide}`;
	},

	render() {

		let dropitems = [
			{ icon: 'user',     content: 'Profile'  },
			{ icon: 'language', content: 'Localization'  },
			{ icon: 'bullhorn', content: 'Feedback'  },
			{ icon: 'sign-out', content: 'Logout'  }
		];

		let objects = [
			[
				[ <Dropdown class='infodrop' show={true} items={dropitems} /> ],
				[
					{ content: 'Return to workspace', class: 'pos-back' },
					{ content: 'Edit board', class:'pos-edit' },
					{ content: 'Share board', class:'pos-share' },
					{ content: 'Export board', class:'pos-export' },
					{ content: 'Make tickets snap to grid', class:'pos-magnet' },
					{ content: 'Toggle board overview and navigate', class:'pos-minimap' },
					{ content: 'Edit your profile', class:'pos-profile' },
					{ content: 'Change operating language', class:'pos-localization' },
					{ content: 'Send feedback to developers', class:'pos-feedback' },
					{ content: 'Logout', class:'pos-logout' }
				]
			],
			[
				[ <img draggable="false" className="ticket-img" src="/dist/assets/img/ticket.png"/>,
				<img draggable="false" className="edit-ticket-img" src="/dist/assets/img/edit-ticket.png"/> ],
				[
					{ content: 'Double tap board to create a ticket.', class: 'pos-click' },
					{ content: 'Double tap a ticket to edit it.', class:'pos-ticket' },
					{ content: 'Select a color for your ticket.', class:'pos-color' },
					{ content: 'Edit the contents of a ticket.', class:'pos-content' }
				]
			],
			[
				[ <img draggable="false" className="info-img" src="/dist/assets/img/edit-board.png"/> ],
				[
					{ content: 'Create or edit the name of this board.', class: 'pos-boardname' },
					{ content: 'Board preview.', class:'pos-boardpreview' },
					{ content: 'Edit the background appearance of this board.', class:'pos-boardbg' },
					{ content: 'Change the size of this board.', class:'pos-boardmeasures' }
				]
			],
			[
				[ <img draggable="false" className="info-img" src="/dist/assets/img/share-board.png"/> ],
				[
					{ content: 'Hit Share to get the URL of this board for sharing.', class: 'pos-format' }
				]
			],
			[
				[ <img draggable="false" className="info-img" src="/dist/assets/img/export-board.png"/> ],
				[
					{ content: 'Select an export format and hit Export to download the file.', class: 'pos-format' }
				]
			]
		];

		return (
			<Dialog className="info" info
					onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="infocarousel"
					data={this.setCarouselData.bind(this, 'carousel')}>

					{objects.map((item) => {
					return (
					<div>
						<TextBoxes items={item[1]} objects={item[0]}/>
					</div>
					);
				})}
				</Carousel>
			</Dialog>
		);

	}
});