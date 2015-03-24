import page  from 'page';
import React from 'react';

import Action     from '../../actions';
import UserAction from '../../actions/user';

import FormView from '../../views/form';

const formOptions = {
	fields: [{
		name:     'email',
		type:     'email',
		label:    'Email',
		required: true,
	}, {
		name:     'password',
		type:     'password',
		label:    'Password',
		required: true,
	}],
	secondary: {
		submit: () => {
			return page.show('/register');
		},
		action:      'Register',
		description: 'Not registered?'
	},
	submit: (state) => {
		return UserAction.login(state).then(() => {
			return page.show('/boards');
		});
	},
	action: 'Login'
}

export default React.createClass({
	render() {
		return <FormView {...formOptions} />;
	}
});
