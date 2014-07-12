module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    clean: {
      test: ['build/hub.test.js']
    },

    concat: {
      dev: {
        files: {
          'build/hub.js': [
            'src/lang/Lang.js',
            'src/lang/trim.js',
            'src/hub.js',
            'src/export.js'
          ]
        }
      },
      test: {
        files: {
          'build/hub.test.js': [
            'src/lang/Lang.js',
            'src/lang/trim.js',
            'src/hub.js'
          ]
        }
      }
    },

    jasmine: {
      dev: {
        src: 'build/hub.test.js',
        options: {
          specs: 'test/spec/hub.spec.js',
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
      },
      prod: {
        src: 'build/hub.min.js',
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
        'build/hub.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      compress: {
        files: {
          'build/hub.min.js': [
            'build/hub.js'
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
          //sourceMap: 'build/hub_sourcemap'
        }
      }
    },

    wrap: {
      dev: {
        src: 'build/hub.js',
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
        src: 'build/hub.test.js',
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