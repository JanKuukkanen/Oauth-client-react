import page  from 'page';
import React from 'react';

import Action          from '../actions';
import UserAction      from '../actions/user';
import BroadcastAction from '../actions/broadcast';

import Dropdown  from '../components/dropdown';
import UserVoice from '../components/user-voice';
import InfoView  from  './dialog/view-info';

/**
 *
 */
export default React.createClass({
	propTypes: {
		title: React.PropTypes.string.isRequired,
	
	},

	getInitialState() {
		return { dropdown: false, feedback: false}
	},

	showWorkspace() {
		return page.show('/boards');
	},

	toggleDropdown() {
		this.setState({ dropdown: !this.state.dropdown });
	},
	toggleInfoView() {
		this.setState({ infoactive: !this.state.infoactive });
	},

	render: function() {
		let infoDialog = null;

		let ibuttonClass = React.addons.classSet({
			infobutton: true,
			active:  this.state.infoactive
		});
		let ubuttonClass = React.addons.classSet({
			avatar: true,
			active:  this.state.dropdown
		});

		if(this.state.infoactive) {
			infoDialog = <InfoView onDismiss={this.toggleInfoView} />
        }

		let items = [
			{ icon: 'user',     content: 'Profile',      disabled: true  },
			{ icon: 'language', content: 'Localization', disabled: true  },
			{
				content: (
					<UserVoice>
						<span className="fa fa-fw fa-bullhorn" />
						Feedback

					</UserVoice>
				)
			},
			{
				onClick: () => {
					UserAction.logout()
						.then(() => {
							return page.show('/');
						})
						.catch((err) => {
							BroadcastAction.add(err, Action.User.Logout);
						});
				},
				icon: 'sign-out', content: 'Logout'
			}
		];
		return (
			<nav className="nav">
				
				<img className="logo" src="/dist/assets/img/logo.svg"
					onClick={this.showWorkspace} />
				<h1 className="title">{this.props.title}</h1>
				<div onClick={this.toggleInfoView} className={ibuttonClass}>
					<span className="fa fa-fw fa-info"></span>
				</div>
				<div onClick={this.toggleDropdown} className={ubuttonClass}>
					<span className="fa fa-fw fa-user"></span>
				</div>
				<Dropdown show={this.state.dropdown} items={items} />
				{infoDialog}
			</nav>

		);
	}
});
