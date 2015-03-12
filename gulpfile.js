'use strict';

var gulp       = require('gulp');
var sass       = require('gulp-sass');
var react      = require('gulp-react');
var mocha      = require('gulp-mocha');
var jshint     = require('gulp-jshint');
var server     = require('gulp-webserver');
var source     = require('vinyl-source-stream');
var envify     = require('envify');
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

gulp.task('sass', function() {
	return gulp.src('src/sass/app.sass')
		.pipe(sass({
			indentedSyntax:  true,
			errLogToConsole: true,
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('static', function() {
	return gulp.src('./src/assets/**/*')
		.pipe(gulp.dest('./dist/assets/'));
});

gulp.task('browserify', function() {
	return browserify('./src/scripts/app.js')
		.transform(reactify)
		.transform(envify)
		.bundle()
		.pipe(source('app.js')).pipe(gulp.dest('dist'));
});

gulp.task('build', ['sass', 'static', 'browserify']);

gulp.task('serve', ['jshint', 'build'], function() {
	return gulp.src('.')
		.pipe(server({
			host:       process.env.HOSTNAME || '0.0.0.0',
			fallback:   'index.html',
			livereload: true,
		}));
});

gulp.task('default', ['serve'], function() {
	gulp.watch('./src/sass/**/*.sass',   ['sass']);
	gulp.watch('./src/scripts/**/*.js',  ['browserify', 'jshint']);
	gulp.watch('./src/scripts/**/*.jsx', ['browserify', 'jshint']);
});
