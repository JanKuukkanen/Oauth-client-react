'use strict';

var path = require('path');
var args = require('minimist')(process.argv);

var gulp       = require('gulp');
var sass       = require('gulp-sass');
var mocha      = require('gulp-mocha');
var eslint     = require('gulp-eslint');
var uglify     = require('gulp-uglify');
var webserver  = require('gulp-webserver');
var sourcemaps = require('gulp-sourcemaps');

var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

var envify     = require('envify');
var babelify   = require('babelify');
var watchify   = require('watchify');
var browserify = require('browserify');

// We need to setup browserify. For regular builds we use 'browserify' by
// itself, but for builds that keep repeating, we use 'watchify'. Note that we
// set the 'debug' flag in order to preserve sourcemaps.
watchify.args           = watchify.args || { }
watchify.args.debug     = process.env.NODE_ENV !== 'production';
watchify.args.fullPaths = process.env.NODE_ENV !== 'production';

var entry   = path.join(__dirname, 'src/scripts/app.js');
var bundler = browserify(entry, watchify.args);

if(args['use-watchify']) {
	bundler = watchify(bundler);
}
bundler = bundler.transform(envify).transform(babelify);

/**
 * Bundles the code using bundler.
 *
 * NOTE If this task is ran in 'production' environment, the sourcemaps are not
 *      present and the code will be minified in order to ensure the smallest
 *      possible size of the generated bundle.
 */
function bundle() {
	var stream = bundler.bundle().pipe(source('app.js'));
	if(process.env.NODE_ENV === 'production') {
		stream = stream.pipe(buffer()).pipe(uglify());
	}
	else {
		stream = stream.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(sourcemaps.write());
	}
	return stream.pipe(gulp.dest('dist'));
}


/**
 * Lint the source code.
 */
gulp.task('lint', function() {
	return gulp.src('src/scripts/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format());
});

/**
 * Unit tests.
 */
gulp.task('test', function() {
	return gulp.src('./test/**/*.js')
		.pipe(mocha({
			globals: {
				should: require('should'),
			},
			reporter: 'spec',
		}))
});

/**
 * Build the JavaScript source files.
 */
gulp.task('build-js', bundle);

/**
 * Build the CSS source.
 */
gulp.task('build-css', function() {
	return gulp.src('src/styles/app.sass')
		.pipe(sass({
			indentedSyntax:  true,
			errLogToConsole: true,
		}))
		.pipe(gulp.dest('dist'));
});

/**
 * Build the various assets, such as images, etc...
 */
gulp.task('build-assets', function() {
	return gulp.src('./src/assets/**/*')
		.pipe(gulp.dest('./dist/assets/'));
});

/**
 * Build everything!
 */
gulp.task('build', ['build-assets', 'build-css', 'build-js']);

/**
 * Serve the static content and run a livereload server.
 */
gulp.task('serve', ['build'], function() {
	return gulp.src('.')
		.pipe(webserver({
			port:       process.env.PORT      || 8000,
			host:       process.env.HOSTNAME  || '0.0.0.0',
			fallback:   'index.html',
			livereload: true,
		}));
});

/**
 * Keep track of the source files and rebuild as necessary.
 */
gulp.task('default', ['serve'], function() {
	gulp.watch('./src/assets/**/*',      [ 'build-assets' ]);
	gulp.watch('./src/styles/**/*.sass', [ 'build-css' ]);
	if(args['use-watchify']) {
		bundler.on('update', bundle);
	}
	else gulp.watch('./src/scripts/**/*.js', [ 'build-js' ]);
});
