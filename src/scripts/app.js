'use strict';

var _     = require('lodash');
var page  = require('page');
var React = require('react');

var socket = require('./utils/socket');

var AuthStore   = require('./stores/auth');
var AuthActions = require('./actions/auth');

var FormView      = require('./views/form.jsx');
var BoardView     = require('./views/board.jsx');
var WorkspaceView = require('./views/workspace.jsx');

// Fix issues with 300ms delay on touch devices, hopefully!
require('fastclick')(document.body);

/**
 * The router, in a sense, is also a view. Thus it should be able to listen to
 * stores the same as other views.
 *
 * We listen to changes in the AuthStore, so that when the user is logged out
 * for various reasons, we can redirect the user to the 'login' page. This in
 * a sense works very similarly to the AngularJS '$http.interceptor'.
 *
 * TODO Once we have a ErrorStore, we might want to listen to that instead,
 *      specifically 401 and 403 errors. On a 401 error we should redirect to
 *      the 'login' view, but what to do on a 403 error? Redirect? Show a page?
 */
AuthStore.addChangeListener(function() {
	if(!AuthStore.getUser() && !AuthStore.getToken()) {
		return page.redirect('/login');
	}
});

/**
 * LoginView.
 *
 * Only users with no active session are able to see this.
 */
page('/login', notLoggedIn, disconnect, function showLoginView(ctx) {
	return React.render(
		React.createElement(FormView, {
			fields: [
				{ name: 'email',    type: 'email',    label: 'Email'    },
				{ name: 'password', type: 'password', label: 'Password' },
			],
			secondary: {
				submit: function() {
					return page.show('/register');
				},
				action:      'Register',
				description: 'Not registered?'
			},
			submit: function(state) {
				return AuthActions.login(state)
					.then(page.show.bind(null, '/boards'));
			},
			action: 'Login'
		}),
		document.getElementById('application'));
});

/**
 * RegisterView.
 *
 * Only users with no active session are able to see this.
 */
page('/register', notLoggedIn, disconnect, function() {
	return React.render(
		React.createElement(FormView, {
			fields: [
				{ name: 'email',    type: 'email',    label: 'Email'    },
				{ name: 'password', type: 'password', label: 'Password' },
			],
			secondary: {
				submit: function() {
					return page.show('/login');
				},
				action:      'Login',
				description: 'Already registered?'
			},
			submit: function(state) {
				return AuthActions.register(state)
					.then(page.show.bind(null, '/login'));
			},
			action: 'Register'
		}),
		document.getElementById('application'));
});

/**
 * WorkspaceView.
 *
 * Users that are logged in should see this. Guests are redirected back to the
 * board they have access to.
 */
page('/boards',
	isLoggedIn, connect,
	function isNotGuest(ctx, next) {
		if(ctx.user.type === 'guest') {
			// If the user is a 'guest' and tries to navigate to the workspace,
			// we just redirect him or her to the board she belongs to...
			return page.redirect('/boards/' + ctx.user.access + '');
		}
		// User was not a 'guest', so we can show the Workspace.
		return next();
	},
	function showWorkspaceView(ctx) {
		return React.render(
			React.createElement(WorkspaceView),
			document.getElementById('application')
		);
	});

/**
 * BoardView.
 *
 * Users that are logged in and have access should see this. Guests that do not
 * have access to this board are redirected to the board they have access to.
 */
page('/boards/:id',
	isLoggedIn,
	function hasGuestAccess(ctx, next) {
		if(ctx.user.type === 'guest') {
			// The user is a guest, so we need to make sure he or she has
			// access to this board. If the user does not have access to this
			// board, we redirect him or her to the board he or she can access.
			if(ctx.user.access === ctx.params.id) {
				return next();
			}
			return page.redirect('/boards/' + ctx.user.access + '');
		}
		return next();
	},
	connect,
	function showBoardView(ctx) {
		return React.render(
			React.createElement(BoardView, { id: ctx.params.id }),
			document.getElementById('application')
		);
	});

/**
 * GuestLoginView
 *
 * Users that do not have active guest sessions should see this. Additionally
 * users that have active guest sessions but to a different board should also
 * see this.
 * Guests with an active guest session on this board will be redirected to the
 * corresponding BoardView.
 */
page('/boards/:id/access/:code',
	function doesNotHaveGuestAccess(ctx, next) {
		if(!(ctx.user = AuthStore.getUser())) {
			// The user is not even logged in, so we can safely show the him or
			// her the view.
			return next();
		}
		if(ctx.user.type === 'guest') {
			// The user is a guest, now we must check if the user has guest
			// access to this board already.
			if(ctx.user.access === ctx.params.id) {
				// The user has access to this board already, redirect!
				return page.redirect('/boards/' + ctx.params.id + '');
			}
		}
		// The user is a regular user, we can show him or her the view.
		return next();
	},
	disconnect,
	function showGuestLoginView(ctx) {
		return React.render(React.createElement(FormView, {
			fields: [
				{ name: 'username', type: 'text', label: 'Username' },
			],
			submit: function(state) {
				var credentials = _.extend(state, {
					boardID:    ctx.params.id,
					accessCode: ctx.params.code,
				});
				return AuthActions.loginGuest(credentials).then(
					page.show.bind(null, '/boards/' + ctx.params.id + ''));
			},
			action: 'Login as Guest'
		}),
		document.getElementById('application'));
	});

/**
 * Default to WorkspaceView.
 */
page('/', function() {
	page.redirect('/boards');
});

/**
 * Simple middleware which opens a socket connection.
 */
function connect(ctx, next) {
	return socket.connect({ token: AuthStore.getToken() }).then(next);
}

/**
 * Simple middleware which attempts to close the current socket.
 */
function disconnect(ctx, next) {
	return socket.disconnect().then(next);
}


/**
 * Middleware for making sure the 'user' is logged in. If the user is not
 * logged in, we redirect to the 'login' page. If the user is logged in, we
 * also refresh the profile by loading the user from the server async.
 */
function isLoggedIn(ctx, next) {
	if((ctx.user = AuthStore.getUser())) {
		return AuthActions.loadUser() && next();
	}
	return page.redirect('/login');
}

/**
 * Middleware for making sure the 'user' is not logged in. If the user is
 * logged in, we just go back to the previous page, or the Workspace if there
 * is no 'previous' page.
 */
function notLoggedIn(ctx, next) {
	if(!(ctx.user = AuthStore.getUser())) {
		// The user is not logged in, show the view.
		return next();
	}
	if(ctx.user.type === 'guest') {
		// The user is a guest, we redirect him or her to the board he or she
		// has access to.
		return page.redirect('/boards/' + ctx.user.access + '');
	}
	// The user is a regular user, so we go back in location, with Workspace as
	// the fallback location.
	return page.back('/boards');
}

page.start();
