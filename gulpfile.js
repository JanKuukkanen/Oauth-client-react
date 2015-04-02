'use strict';

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
watchify.args       = watchify.args || { }
watchify.args.debug = true;

var bundler = args['use-watchify']
	? watchify(browserify('./src/scripts/app.js', watchify.args))
		.transform(envify).transform(babelify)
	: browserify('./src/scripts/app.js', { debug: true })
		.transform(envify).transform(babelify);

/**
 * Bundles the code using bundler.
 *
 * NOTE If this task is ran with a 'production' flag, the code will be minified
 *      without sourcemaps. By default the code is built with sourcemaps within
 *      the code, and not minified.
 */
function bundle() {
	var stream = bundler.bundle()
		.pipe(source('app.js'));

	if(args.production) {
		stream = stream
			.pipe(buffer())
			.pipe(uglify());
	}
	else {
		stream = stream
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(sourcemaps.write());
	}

	stream = stream
		.pipe(gulp.dest('dist'));

	return stream;
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
			host:       process.env.HOSTNAME || '0.0.0.0',
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
	// There is some issue with 'gulp-watch' and rebuilding the bundle not
	// actually taking changes in the code into account. However, if running
	// the build tasks on a 'vagrant' machine, the bundler 'update' event never
	// fires, so we need to use 'gulp-watch' then.
	if(args['use-gulp-watch']) {
		gulp.watch('./src/scripts/**/*.js', [ 'build-js' ]);
	}
	else bundler.on('update', bundle);
});
