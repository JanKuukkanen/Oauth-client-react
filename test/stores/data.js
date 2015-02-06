'use strict';

var purdy = require('purdy');

var DataStore   = require('../../src/scripts/stores/data');
var DataActions = require('../../src/scripts/actions/data');

/**
 * To be honest we also test 'DataActions' here...
 */
describe('DataStore', function() {

	describe('DataActions', function() {
		describe('.loadBoards', function() {
			it('DataStore should emit change', function(done) {
				DataStore.once('change', function() {
					return done();
				});
				return DataActions.loadBoards();
			});
		});
		describe('.loadTickets', function() {
			it('DataStore should emit change', function(done) {
				DataStore.once('change', function() {
					return done();
				});
				return DataActions.loadTickets('123ABC');
			});
		});
	});

	// describe('.getBoard', function() {
	// 	it('should emit change', function() {
	// 		DataStore
	// 	});
	// });

	// describe('.loadTickets', function() {
	// 	it('should emit change', function() {

	// 	});
	// });
});
