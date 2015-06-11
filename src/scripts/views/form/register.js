import page  from 'page';
import React from 'react';

import Action          from '../../actions';
import UserAction      from '../../actions/user';
import BroadcastAction from '../../actions/broadcast';

import FormView from '../../views/form';

const formOptions = {
	fields: [
		{
			name:     'email',
			type:     'email',
			label:    'Email',
			required: true
		},
		{
			name:     'password',
			type:     'password',
			label:    'Password',
			title:    'Minimum of 8 characters required.',
			pattern:  '.{8,}',
			required: true
		}
	],
	secondary: {
		submit: () => {
			return page.show('/login');
		},
		action:      'Login',
		description: 'Already registered?'
	},
	submit: (state) => {
		return UserAction.register(state).then(() => {
			return UserAction.login(state).then(() => {
				BroadcastAction.add({
					type:    'broadcast',
					content: 'Welcome!'
				});
				return page.show('/boards');
			});
		});
	},
	help:   'Passwords must be at least 8 characters long.',
	action: 'Register'
}

export default React.createClass({
	render() {
		return <FormView {...formOptions} />;
	}
});
