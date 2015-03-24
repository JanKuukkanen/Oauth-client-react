import flux from '../utils/flux';

import User   from '../models/user';
import Action from '../actions';

// Create a reference and just 'merge' from there on out, this way if nothing
// changes we don't actually trigger any re-renders.
let user = new User();

/**
 *
 */
export default flux.store({
	getUser() {
		if(localStorage.getItem('user')) {
			let parsed = JSON.parse(localStorage.getItem('user'));
			return user.merge({
				id:       parsed.id,
				type:     parsed.type,
				access:   parsed.access,
				username: parsed.name
			});
		}
		return null;
	},

	getToken() {
		return localStorage.getItem('token');
	},

	handlers: {
		[Action.User.Load](payload) {
			localStorage.setItem('user', JSON.stringify(payload.user));
		},

		[Action.User.Login](payload) {
			localStorage.setItem('user',  JSON.stringify(payload.user));
			localStorage.setItem('token', payload.token);
		},

		[Action.User.Logout](payload) {
			localStorage.removeItem('user');
			localStorage.removeItem('token');
		}
	}
});
