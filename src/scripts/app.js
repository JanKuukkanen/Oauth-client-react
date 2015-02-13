'use strict';

var _     = require('lodash');
var page  = require('page');
var React = require('react');

var socket = require('./utils/socket');

var AuthStore   = require('./stores/auth');
var AuthActions = require('./actions/auth');

var BoardView      = require('./views/board.jsx');
var WorkspaceView  = require('./views/workspace.jsx');
var LoginView      = require('./views/login.jsx');
var GuestLoginView = require('./views/guest-login.jsx');
var RegisterView   = require('./views/register.jsx');

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
page('/login',
	notLoggedIn, disconnect,
	function showLoginView(ctx) {
		return React.render(React.createElement(LoginView), document.body);
	});

/**
 * RegisterView.
 *
 * Only users with no active session are able to see this.
 */
page('/register',
	notLoggedIn, disconnect,
	function showRegisterView(ctx) {
		return React.render(React.createElement(RegisterView), document.body);
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
		return React.render(React.createElement(WorkspaceView), document.body);
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
		var view = React.createElement(BoardView, {
			id: ctx.params.id,
		});
		return React.render(view, document.body);
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
		var view = React.createElement(GuestLoginView, {
			boardID:    ctx.params.id,
			accessCode: ctx.params.code,
		});
		return React.render(view, document.body);
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
	socket.connect({ token: AuthStore.getToken() });
	return next();
}

/**
 * Simple middleware which attempts to close the current socket.
 */
function disconnect(ctx, next) {
	socket.disconnect();
	return next();
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
