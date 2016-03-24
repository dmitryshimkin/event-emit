'use strict';

var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter');

var jasmine = new Jasmine();

jasmine.addReporter(new SpecReporter());

jasmine.loadConfig({
  'spec_dir': 'test',
  'spec_files': [
    'spec/*.spec.js'
  ],
  'helpers': [
  ],
  'stopSpecOnExpectationFailure': false,
  'random': false
});

jasmine.execute();
