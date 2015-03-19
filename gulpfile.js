'use strict';

var gulp       = require('gulp');
var sass       = require('gulp-sass');
var mocha      = require('gulp-mocha');
var jshint     = require('gulp-jshint');
var server     = require('gulp-webserver');
var source     = require('vinyl-source-stream');
var envify     = require('envify');
var babelify   = require('babelify');
var watchify   = require('watchify');
var browserify = require('browserify');

// Setup our Browserify transform, so that it supports watchify.
var bundler = watchify(browserify('./src/scripts/app.js', watchify.args))
	.transform(envify)
	.transform(babelify);

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
 * Static code analysis.
 */
gulp.task('lint', function() {
	return gulp.src('./src/scripts/**/*')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'));
});

/**
 * Build the JavaScript source.
 */
gulp.task('build-js', function() {
	return bundler.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('dist'));
});

/**
 * Build the CSS source.
 */
gulp.task('build-css', function() {
	return gulp.src('src/sass/app.sass')
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
		.pipe(server({
			host:       process.env.HOSTNAME || '0.0.0.0',
			fallback:   'index.html',
			livereload: true,
		}));
});

/**
 * Keep track of the source files and rebuild as necessary.
 */
gulp.task('default', ['serve'], function() {
	gulp.watch('./src/sass/**/*.sass',   ['build-css']);
	gulp.watch('./src/assets/**/*',      ['build-assets']);
	gulp.watch('./src/scripts/**/*.js',  ['lint', 'build-js']);
	gulp.watch('./src/scripts/**/*.jsx', ['lint', 'build-js']);
});
