import page  from 'page';
import React from 'react';

import Action     from '../../actions';
import UserAction from '../../actions/user';

import FormView from '../../views/form';

export default React.createClass({
	propTypes: {
		boardID:    React.PropTypes.string.isRequired,
		accessCode: React.PropTypes.string.isRequired
	},

	render() {
		let options = {
			fields: [{
				name:     'username',
				type:     'text',
				label:    'Username',
				title:    'Username must be at least 3 characters.',
				pattern:  '.{3,}',
				required: true,
			}],
			submit: (state) => {
				let credentials = Object.assign(state, {
					boardID:    this.props.id,
					accessCode: this.props.code
				});
				return UserAction.login(credentials, true).then(() => {
					return page.show(`/boards/${ctx.params.id}`);
				});
			},
			action: 'Login as Guest'
		}
		return (
			<FormView {...options} />
		);
	}
});
