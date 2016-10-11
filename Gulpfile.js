'use strict';

var gulp = require('gulp');
var header = require('gulp-header');
var indent = require('gulp-indent');
var rename = require('gulp-rename');
var sizereport = require('gulp-sizereport');
var uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');

var pkg = require('./package.json');

var umd = [
  ';(function(root, factory) {',
  '  /* istanbul ignore next */',
  '  if (typeof define === \'function\' && define.amd) {',
  '    define([], factory);',
  '  } else if (typeof exports === \'object\') {',
  '    /* istanbul ignore next */',
  '    module.exports = factory();',
  '  } else {',
  '    /* istanbul ignore next */',
  '    root.EventEmit = factory();',
  '  }',
  '}(this, function () {',
  '  \'use strict\';',
  '',
  '<%= contents %>',
  '  return EventEmit;',
  '}));'
].join('\n');

function getBanner () {
  return [
    '/**',
    ' * event-emit',
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
    .pipe(wrap(umd))
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
