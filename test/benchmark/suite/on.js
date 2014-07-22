'use strict';

// ===============================
// Preparation
// ===============================

var Hub = require('../../../dist/hub');
var Backbone = require('../lib/backbone');
var Emitter = require('../lib/event-emitter');
var Emitter2 = require('../lib/event-emitter2');
var PubSub = require('../lib/pubsub');

function handlerA () {}
function handlerB () {}
function handlerC () {}

var emitter = new Emitter();
var emitter2 = new Emitter2();

// ===============================
// Suites
// ===============================

module.exports = {
  name: 'subscribe',
  tests: {
    'Hub': function () {
      Hub.on('event1', handlerA);
      Hub.on('event2', handlerB);
      Hub.on('event3', handlerC);
    },

    'PubSub': function () {
      PubSub.subscribe('event1', handlerA);
      PubSub.subscribe('event2', handlerB);
      PubSub.subscribe('event3', handlerC);
    },

    'EventEmitter': function () {
      emitter.addListener('event1', handlerA);
      emitter.addListener('event2', handlerB);
      emitter.addListener('event3', handlerC);
    },

    'EventEmitter2': function () {
      emitter2.on('event1', handlerA);
      emitter2.on('event2', handlerB);
      emitter2.on('event3', handlerC);
    },

    'Backbone': function () {
      Backbone.on('event1', handlerA);
      Backbone.on('event2', handlerB);
      Backbone.on('event3', handlerC);
    }
  }
};
