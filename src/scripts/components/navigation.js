import page  from 'page';
import React from 'react';

import Action          from '../actions';
import UserAction      from '../actions/user';
import BroadcastAction from '../actions/broadcast';

import Dropdown  from '../components/dropdown';
import UserVoice from '../components/user-voice';

/**
 *
 */
export default React.createClass({
	propTypes: {
		title: React.PropTypes.string.isRequired
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

	render: function() {
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
				<section className="title">
					<img src="/dist/assets/img/logo.svg" onClick={this.showWorkspace} />
					<h1>{this.props.title}</h1>
				</section>
				<section className="profile">
					<div className="avatar" onClick={this.toggleDropdown}>
						<span className="fa fa-fw fa-user"></span>
					</div>
					<Dropdown show={this.state.dropdown} items={items} />
				</section>
			</nav>
		);
	}
});
