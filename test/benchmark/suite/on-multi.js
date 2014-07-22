'use strict';

// ===============================
// Preparation
// ===============================

var Hub = require('../../../dist/hub');
var Backbone = require('../lib/backbone');
var EventEmitter = require('../lib/event-emitter');
var PubSub = require('../lib/pubsub');

function handlerA () {}
function handlerB () {}
function handlerC () {}

var emitter = new EventEmitter();

// ===============================
// Suites
// ===============================

module.exports = {
  name: 'subscribe to list of events',
  tests: {
    'Hub': function () {
      Hub.on('event1 event2 event3', handlerA);
      Hub.on('event2 event3', handlerB);
      Hub.on('event3 event1', handlerC);
    },

    'PubSub': function () {
      PubSub.subscribe('event1 event2 event3', handlerA);
      PubSub.subscribe('event2 event3', handlerB);
      PubSub.subscribe('event3 event1', handlerC);
    },

    'EventEmitter': function () {
      emitter.addListener('event1 event2 event3', handlerA);
      emitter.addListener('event2 event3', handlerB);
      emitter.addListener('event3 event1', handlerC);
    },

    'Backbone': function () {
      Backbone.on('event1 event2 event3', handlerA);
      Backbone.on('event2 event3', handlerB);
      Backbone.on('event3 event1', handlerC);
    }
  }
};
