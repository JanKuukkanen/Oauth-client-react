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
		showhelp: React.PropTypes.bool
	},

	getInitialState() {
		return { dropdown: false, feedback: false }
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
		let activeclick = null;
		let infoicon = null;

		if(!this.state.infoactive){
			infoicon = 'info';
			infoDialog = null;
			activeclick = this.toggleDropdown;
		}else {
			infoicon = 'times';
			infoDialog = <InfoView onDismiss = { this.toggleInfoView} />;
			activeclick = () => {};
		}

		let ibuttonClass = React.addons.classSet({
			infobutton: true,
			active: this.state.infoactive
		});
		let ubuttonClass = React.addons.classSet({
			avatar: true,
			active: this.state.dropdown
		});

		let showinfo = this.props.showhelp ?
			<div onClick={this.toggleInfoView} className={ibuttonClass}>
				<span className={`fa fa-fw fa-${infoicon}`}></span>
			</div> : null;

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
				{showinfo}
				<div id="avatar" onClick={activeclick} className={ubuttonClass}>
					<span className="fa fa-fw fa-user"></span>
				</div>
				<Dropdown show={this.state.dropdown} items={items} />
				{infoDialog}
			</nav>

		);
	}
});
