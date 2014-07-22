module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    availabletasks: {
      tasks: {
        options: {
          filter: 'include',
          tasks: [
            'build',
            'lint',
            'perf',
            'test'
          ]
        }
      }
    },

    benchmark: {
      all: {
        src: [
          //'test/benchmark/suite/on.js',
          //'test/benchmark/suite/off.js'
          'test/benchmark/suite/trigger.js'
          //'test/benchmark/suite/on-multi.js'
        ],
        dest: 'test/report/benchmark.csv'
      }
    },

    clean: {
      test: ['dist/hub.test.js']
    },

    concat: {
      dev: {
        files: {
          'dist/hub.js': [
            'src/mixin/Mixin.js',
            'src/mixin/event.js',
            'src/hub.js',
            'src/export.js'
          ]
        }
      },
      test: {
        files: {
          'dist/hub.test.js': [
            'src/mixin/Mixin.js',
            'src/mixin/event.js',
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

    jscs: {
      all: {
        options: require('./.jscs.json'),
        files: {
          src: [
            'Gruntfile.js',
            'src/**',
            '!node_modules/**'
          ]
        }
      }
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'src/**',
        '!node_modules/**'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    pkg: grunt.file.readJSON('package.json'),

    replace: {
      dev: {
        src: ['dist/hub.js'],
        overwrite: true,
        replacements: [
          {
            from: '\'use strict\';\n\n',
            to: ''
          },
          {
            from: /\/\* jshint \S+:\S+ \*\/\n/g,
            to: ''
          }
        ]
      }
    },

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

  grunt.loadNpmTasks('grunt-available-tasks');
  grunt.loadNpmTasks('grunt-benchmark');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-jscs-checker');
  grunt.loadNpmTasks('grunt-wrap');

  // Benchmark
  grunt.registerTask('perf', 'Run benchmark', [
    'build:dev',
    'benchmark'
  ]);

  // Build
  grunt.registerTask('build-dev', [
    'concat:dev',
    'replace:dev',
    'wrap:dev'
  ]);

  grunt.registerTask('build-test', [
    'concat:test'
  ]);

  grunt.registerTask('build-prod', [
    'build-dev',
    'uglify:compress'
  ]);

  grunt.registerTask('build', 'Creates development and production build', [
    'build-dev',
    'build-prod'
  ]);

  // Test
  grunt.registerTask('test-dev', [
    'build-test',
    'jasmine:dev',
    'clean:test'
  ]);

  grunt.registerTask('test-prod', [
    'build-prod',
    'jasmine:prod',
    'clean:test'
  ]);

  grunt.registerTask('test', 'Run tests with code coverage using jasmine and istanbul', [
    'test-prod',
    'test-dev'
  ]);

  grunt.registerTask('prod', ['build-prod']);

  grunt.registerTask('lint', 'Lint files using jscs and jshint', [
    'jscs',
    'jshint'
  ]);

  // Default
  grunt.registerTask('default', [
    'availabletasks'
  ]);
};
