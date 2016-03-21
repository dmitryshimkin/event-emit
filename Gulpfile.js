'use strict';

var gulp = require('gulp');
var header = require('gulp-header');
var indent = require('gulp-indent');
var rename = require('gulp-rename');
var sizereport = require('gulp-sizereport');
var uglify = require('gulp-uglify');
var umd = require('gulp-umd');

var pkg = require('./package.json');

function getBanner () {
  return [
    '/**',
    ' * Event Emitter',
    ' * Version: <%= version %>',
    ' * Author: <%= author %>',
    ' * License: MIT',
    ' * https://github.com/dmitryshimkin/emitter',
    ' */',
    ''
  ].join('\n')
}

/**
 * Builds distributive version
 * -------------------------------------------
 */

gulp.task('build', function () {
  return gulp.src('./src/EventEmit.js')
    .pipe(indent())
    .pipe(umd())
    .pipe(header(getBanner(), pkg))
    .pipe(rename('event-emit.js'))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Creates minified version
 * -------------------------------------------
 */

gulp.task('minify', function () {
  return gulp.src('./dist/event-emit.js')
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(rename('event-emit.min.js'))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Prints report about file size
 * -------------------------------------------
 */

gulp.task('report', function () {
  return gulp.src('dist/*')
    .pipe(sizereport({
      gzip: true,
      total: false
    }));
});

/**
 * Default task
 * -------------------------------------------
 */

gulp.task('default', ['build']);
