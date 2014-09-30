'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jsdoc = require("gulp-jsdoc");

gulp.task('unitTests', function () {
	return gulp.src('test/test.js', {read: false})
		.pipe(mocha({reporter: 'nyan'}));
});

gulp.task('generateDoc', function () {
	return gulp.src("./*.js")
  	.pipe(jsdoc('./documentation-output'))
});

// Default Task
gulp.task('default', ['unitTests', 'generateDoc']);