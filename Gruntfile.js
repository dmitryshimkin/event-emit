module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    clean: {
      test: ['dist/hub.test.js']
    },

    concat: {
      dev: {
        files: {
          'dist/hub.js': [
            'src/lang/Lang.js',
            'src/lang/trim.js',
            'src/hub.js',
            'src/export.js'
          ]
        }
      },
      test: {
        files: {
          'dist/hub.test.js': [
            'src/lang/Lang.js',
            'src/lang/trim.js',
            'src/hub.js'
          ]
        }
      }
    },

    jasmine: {
      dev: {
        src: 'dist/hub.test.js',
        options: {
          specs: 'test/spec/hub.spec.js',
          template: require('grunt-template-jasmine-istanbul'),
          outfile: 'test.html',
          keepRunner: true,
          templateOptions: {
            coverage: 'test/report/coverage.json',
            report: [
              {
                type: 'html',
                options: {
                  dir: 'test/report/html'
                }
              }
            ]
          }
        }
      },
      prod: {
        src: 'dist/hub.min.js',
        options: {
          specs: [
            'test/spec/hub.spec.js'
          ],
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'test/report/coverage.json',
            report: [
              {
                type: 'html',
                options: {
                  dir: 'test/report/html'
                }
              }
            ]
          }
        }
      }
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'dist/hub.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      compress: {
        files: {
          'dist/hub.min.js': [
            'dist/hub.js'
          ]
        },
        options: {
          banner: [
            '/*!',
            ' * <%= pkg.name %> - v<%= pkg.version %>',
            ' * <%= grunt.template.today("yyyy-mm-dd") %>',
            ' */',
            ''
          ].join('\n'),
          mangle: true,
          report: 'gzip'
          //sourceMap: 'dist/hub_sourcemap'
        }
      }
    },

    wrap: {
      dev: {
        src: 'dist/hub.js',
        dest: '',
        options: {
          indent: '  ',
          wrapper: [
            '(function (undefined) {\n  \'use strict\';\n',
            '\n}());'
          ]
        }
      },
      test: {
        src: 'dist/hub.test.js',
        dest: '',
        options: {
          indent: '  ',
          wrapper: [
            '(function (undefined) {\n  \'use strict\';\n',
            '\n}());'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-wrap');

  // build
  grunt.registerTask('build-dev', ['concat:dev', 'wrap:dev']);
  grunt.registerTask('build-test', ['concat:test']);
  grunt.registerTask('build-prod', ['build-dev', 'uglify:compress']);

  // test
  grunt.registerTask('test-dev', ['build-test', 'jasmine:dev']);
  grunt.registerTask('test-prod', ['build-prod', 'jasmine:prod']);

  // alias
  grunt.registerTask('test', ['test-dev', 'clean:test']);
  grunt.registerTask('prod', ['build-prod']);
  grunt.registerTask('lint', ['build-dev', 'jshint']);

  // default
  grunt.registerTask('default', ['build-dev']);
};
