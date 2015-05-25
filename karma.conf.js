'use strict';

module.exports = function(config) {
	return config.set({
		frameworks: [
			'browserify', 'mocha'
		],

		preprocessors: {
			'test/**/*.js': [ 'browserify' ],
		},

		browsers:  [ 'PhantomJS' ],
		reporters: [ 'mocha' ],


		browserify: {
			debug:     true,
			paths:     [ 'node_modules', 'src/scripts' ],
			transform: [ 'babelify', 'envify' ]
		}
	});
}
