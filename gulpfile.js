'use strict';

var gulp       = require('gulp');
var less       = require('gulp-less');
var react      = require('gulp-react');
var mocha      = require('gulp-mocha');
var jshint     = require('gulp-jshint');
var server     = require('gulp-webserver');
var source     = require('vinyl-source-stream');
var reactify   = require('reactify');
var browserify = require('browserify');

gulp.task('test', function() {
	return gulp.src('./test/**/*.js')
		.pipe(mocha({
			globals: {
				should: require('should'),
			},
			reporter: 'spec',
		}))
});

gulp.task('jshint', function() {
	return gulp.src('./src/scripts/**/*')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('less', function() {
	return gulp.src('./src/styles/**/*.less')
		.pipe(less().on('error', console.error))
		.pipe(gulp.dest('./dist/styles/'))

});

gulp.task('static', function() {
	return gulp.src('./src/assets/**/*')
		.pipe(gulp.dest('./dist/assets/'));
});

gulp.task('browserify', function() {
	return browserify('./src/scripts/app.js')
		.transform(reactify)
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('build', ['less', 'static', 'browserify']);

gulp.task('serve', ['jshint', 'test', 'build'], function() {
	return gulp.src('.')
		.pipe(server({
			host:       process.env.HOSTNAME || '0.0.0.0',
			fallback:   'index.html',
			livereload: true,
		}));
});

gulp.task('default', ['serve'], function() {
	gulp.watch('./src/styles/**/*.less', ['less']);
	gulp.watch('./src/scripts/**/*.js',  ['browserify', 'test', 'jshint']);
	gulp.watch('./src/scripts/**/*.jsx', ['browserify', 'test', 'jshint']);
});
