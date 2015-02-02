'use strict';

var page  = require('page');
var React = require('react');

var AuthStore   = require('./stores/auth');
var AuthActions = require('./actions/auth');

var BoardView     = require('./views/board.jsx');
var WorkspaceView = require('./views/workspace.jsx');
var LoginView     = require('./views/login.jsx');
var RegisterView  = require('./views/register.jsx');

// Fix issues with 300ms delay on touch devices, hopefully!
require('fastclick')(document.body);

/**
 * LoginView.
 */
page('/login', notLoggedIn, function showLoginView(ctx) {
	return React.render(React.createElement(LoginView), document.body);
});

/**
 * RegisterView.
 */
page('/register', notLoggedIn, function showRegisterView(ctx) {
	return React.render(React.createElement(RegisterView), document.body);
});

/**
 * WorkspaceView.
 */
page('/boards', isLoggedIn, function showWorkspaceView(ctx) {
	var view = React.createElement(WorkspaceView, {
		user: ctx.user,
	});
	return React.render(view, document.body);
});

/**
 * BoardView.
 */
page('/boards/:id', isLoggedIn, function showBoardView(ctx) {
	var view = React.createElement(BoardView, {
		id:   ctx.params.id,
		user: ctx.user,
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
 * The router, in a sense, is also a view. Thus it should be able to listen to
 * stores the same as other views.
 *
 * We listen to changes in the AuthStore, so that when the user is logged out
 * for various reasons, we can redirect the user to the 'login' page. This in
 * a sense works very similarly to the AngularJS '$http.interceptor'.
 *
 * TODO Should we also redirect the user, if a login is succesful?
 */
AuthStore.addChangeListener(function() {
	if(!AuthStore.getUser() && !AuthStore.getToken()) {
		return page.redirect('/login');
	}
});

/**
 * Middleware for making sure the 'user' is logged in. If the user is not
 * logged in, we redirect to the 'login' page. If the user is logged in, we
 * also refresh the profile by loading the user from the server async.
 */
function isLoggedIn(ctx, next) {
	if((ctx.user = AuthStore.getUser()) && AuthStore.getToken()) {
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
	if(!AuthStore.getUser() && !AuthStore.getToken()) {
		return next();
	}
	return page.back('/boards');
}

page.start();
