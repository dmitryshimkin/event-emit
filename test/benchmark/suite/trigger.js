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

Hub.on('event', handlerA);
Hub.on('event', handlerB);
Hub.on('event', handlerC);

PubSub.subscribe('event', handlerA);
PubSub.subscribe('event', handlerB);
PubSub.subscribe('event', handlerC);

emitter.addListener('event', handlerA);
emitter.addListener('event', handlerB);
emitter.addListener('event', handlerC);

emitter2.on('event', handlerA);
emitter2.on('event', handlerB);
emitter2.on('event', handlerC);

Backbone.on('event', handlerA);
Backbone.on('event', handlerB);
Backbone.on('event', handlerC);

// ===============================
// Suites
// ===============================

module.exports = {
  name: 'trigger',
  tests: {
    'Hub': function () {
      Hub.trigger('event')
    },

    'PubSub': function () {
      PubSub.publish('event', {
        foo: 'foo',
        bar: 'bar'
      });
    },

    'EventEmitter': function () {
      emitter.trigger('event', ['foo', 'bar']);
    },

    'EventEmitter2': function () {
      emitter2.trigger('event', ['foo', 'bar']);
    },

    'Backbone': function () {
      Backbone.trigger('event', 'foo', 'bar');
    }
  }
};
