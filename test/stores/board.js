'use strict';

var purdy = require('purdy');

var BoardStore   = require('../../src/scripts/stores/board');
var BoardActions = require('../../src/scripts/actions/board');

/**
 * To be honest we also test 'BoardActions' here...
 */
describe('BoardStore', function() {

	describe('BoardActions', function() {
		describe('.loadBoards', function() {
			it('BoardStore should emit change', function(done) {
				BoardStore.once('change', function() {
					return done();
				});
				return BoardActions.loadBoards();
			});
		});
	});
});
