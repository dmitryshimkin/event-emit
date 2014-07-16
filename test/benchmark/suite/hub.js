'use strict';

// ===============================
// Preparation
// ===============================


// ===============================
// Suites
// ===============================

module.exports = {
  name: 'Test name',
  tests: {
    'Hub': function () {
      return true;
    },

    'PubSub': function () {
      return true;
    },

    'EventEmitter': function () {
      return true;
    },

    'Backbone': function () {
      return true;
    }
  }
};
