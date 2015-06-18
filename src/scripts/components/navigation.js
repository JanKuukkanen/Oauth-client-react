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
		showHelp: React.PropTypes.bool
	},

	getInitialState() {
		return { dropdown: false, feedback: false, infoActive: false }
		},

	showWorkspace() {
		return page.show('/boards');
	},

	toggleDropdown() {
		this.setState({ dropdown: !this.state.dropdown });
	},
	toggleInfoView() {
		this.setState({ infoActive: !this.state.infoActive });
	},

	render: function() {
		let infoDialog = null;
		let activeClick = null;
		let infoIcon = null;

		if(!this.state.infoActive) {
			infoIcon = 'info';
			infoDialog = null;
			activeClick = this.toggleDropdown;
		} else {
			infoIcon = 'times';
			infoDialog = <InfoView onDismiss = { this.toggleInfoView} />;
			activeClick = () => {};
		}

		let infoButtonClass =
			React.addons.classSet({
				infobutton: true,
				active: this.state.infoActive
			});
		let userButtonClass =
			React.addons.classSet({
				avatar: true,
				active: this.state.dropdown
			});

		let showInfo = !this.props.showHelp ? null : (
			<div onClick={this.toggleInfoView} className={infoButtonClass}>
				<span className={`fa fa-fw fa-${infoIcon}`}></span>
			</div>
			);

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
			<nav id="nav" className="nav">
				<img className="logo" src="/dist/assets/img/logo.svg"
					onClick={this.showWorkspace} />
				<h1 className="title">{this.props.title}</h1>
				{showInfo}
				<div id="avatar" onClick={activeClick} className={userButtonClass}>
					<span className="fa fa-fw fa-user"></span>
				</div>
				<Dropdown show={this.state.dropdown} items={items} />
				{infoDialog}
			</nav>

		);
	}
});