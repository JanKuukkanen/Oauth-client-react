'use strict';

var page  = require('page');
var React = require('react');

var BoardView     = require('./views/board.jsx');
var WorkspaceView = require('./views/workspace.jsx');
// var LoginView     = require('./views/login.jsx');
// var RegisterView  = require('./views/register.jsx');

// Fix issues with 300ms delay on touch devices, hopefully!
require('fastclick')(document.body);

/**
 * Middleware for 'page'.
 */
function authenticate(ctx, next) {
	// Mock user, need an 'AuthStore' implementation...
	ctx.user = {
		id: '123-456', name: 'narsuman', type: 'user',
	}
	return next();
}

page('/boards',
	authenticate,
	function(ctx) {
		var view = React.createElement(WorkspaceView, {
			user: ctx.user,
		});
		return React.render(view, document.body);
	});

page('/boards/:id',
	authenticate,
	function(ctx) {
		var view = React.createElement(BoardView, {
			id:   ctx.params.id,
			user: ctx.user,
		});
		return React.render(view, document.body);
	});

page('*', function() {
	page.show('/boards');
});

page.start();
