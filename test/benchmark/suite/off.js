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
  name: 'unsubscribe',
  tests: {
    'Hub': function () {
      Hub.on('event', handlerA);
      Hub.on('event', handlerB);
      Hub.on('event', handlerC);
      Hub.off('event', handlerB);
      Hub.off('event', handlerC);
      Hub.off('event', handlerA);
    },

    'PubSub': function () {
      PubSub.subscribe('event', handlerA);
      PubSub.subscribe('event', handlerB);
      PubSub.subscribe('event', handlerC);
      PubSub.unsubscribe('event', handlerB);
      PubSub.unsubscribe('event', handlerC);
      PubSub.unsubscribe('event', handlerA);
    },

    'EventEmitter': function () {
      emitter.addListener('event', handlerA);
      emitter.addListener('event', handlerB);
      emitter.addListener('event', handlerC);
      emitter.removeListener('event', handlerB);
      emitter.removeListener('event', handlerC);
      emitter.removeListener('event', handlerA);
    },

    'EventEmitter2': function () {
      emitter2.on('event', handlerA);
      emitter2.on('event', handlerB);
      emitter2.on('event', handlerC);
      emitter2.off('event', handlerB);
      emitter2.off('event', handlerC);
      emitter2.off('event', handlerA);
    },

    'Backbone': function () {
      Backbone.on('event', handlerA);
      Backbone.on('event', handlerB);
      Backbone.on('event', handlerC);
      Backbone.off('event', handlerB);
      Backbone.off('event', handlerC);
      Backbone.off('event', handlerA);
    }
  }
};
