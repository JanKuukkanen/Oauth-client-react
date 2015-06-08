import page  from 'page';

/**
 *
 */

export default
	{
		registerForm: {
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
				},
				{
					name:     'passwordagain',
					type:     'password',
					label:    'Retype your password',
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
		},
		loginForm: {
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
					required: true
				}
			],
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
	}
