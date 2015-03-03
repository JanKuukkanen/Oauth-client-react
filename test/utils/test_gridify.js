'use strict'

var purdy = require('purdy');

var gridify = require('../../src/scripts/utils/gridify');

/**
 * Testing gridify.js if it can take the ticket's coordinates and snap it to 
 * the grid properly. Ticket size is x=192 and y=108
 */
describe('Gridify', function() {
	it('Gridify should return the same coordinates when given grid point coordinates', function() {
		var position = gridify({x:192, y:108});
		position.x.should.equal(192) && position.y.should.equal(108);
	});

	it('Gridify should return x=0 when x is less than 192', function() {
		var position = gridify({x:50, y:108});
		position.x.should.equal(0) && position.y.should.equal(108);
	});

	it('Gridify should return y=0 when y is less than 108', function () {
		var position = gridify({x:192, y:50});
		position.x.should.equal(192) && position.y.should.equal(0);
	});

	it('Gridify should return x=192 when x is more than 192 and less than 384', function() {
                var position = gridify({x:250, y:108});
		position.x.should.equal(192) && position.y.should.equal(108);
	});

	it('Gridify should return y=108 when y is more than 108 and less than 216', function() {
		var position = gridify({x:192, y:150});
		position.x.should.equal(192) && position.y.should.equal(108);
	});
});
