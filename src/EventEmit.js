'use strict';

var slice = Array.prototype.slice;
var R_SPACE = /\s+/;

/**
 * Event Emit class
 * @class
 */
function EventEmit () {
}

/**
 * Adds a subscription to given event with given handler.
 * @param  {String}   events
 * @param  {Function} handler
 * @param  {Object}   [context]
 * @param  {Boolean}  [once]
 * @returns {Object}
 */

function on (events, handler, context, once) {
  var all = this._subscriptions;
  var eventsList = events.split(R_SPACE);
  var i = eventsList.length;
  var event;
  var entries;

  if (all === undefined) {
    all = this._subscriptions = {};
  }

  while (i--) {
    event = eventsList[i];
    entries = all[event];

    if (entries === undefined) {
      entries = all[event] = [];
    }

    entries.push({
      ctx: context,
      fn: handler,
      once: once
    });
  }

  return this;
}

/**
 * Adds a single subscription to given event
 * @param   {String}   events
 * @param   {Function} handler
 * @param   {Object}   [context]
 * @returns {Object}
 */

function once (events, handler, context) {
  return this.on(events, handler, context, true);
}

/**
 * Removes a subscription
 * @param   {String}   events
 * @param   {Function} handler
 * @param   {Object}   [context]
 * @returns {Object}
 */

function off (events, handler, context) {
  if (!this._subscriptions) {
    return this;
  }

  var eventsList = events.split(R_SPACE);
  var eventsCount = eventsList.length;
  var event;
  var i = -1;
  var j;
  var subscribers;
  var subscriber;
  var subscribersCount;
  var checkHandler = handler !== undefined;
  var checkContext = context !== undefined;
  var index;

  var retain;
  var toBeRetained;
  var removed;

  while (++i < eventsCount) {
    event = eventsList[i];

    subscribers = this._subscriptions[event] || [];
    subscribersCount = subscribers.length;

    index = -1;
    j = -1;

    if (!checkHandler) {
      this._subscriptions[event] = [];
      continue;
    }

    retain = [];
    removed = false;

    for (j = 0; j < subscribersCount; j++) {
      subscriber = subscribers[j];
      toBeRetained = true;

      if (!removed) {
        if (checkContext) {
          if (subscriber.fn === handler && subscriber.ctx === context) {
            toBeRetained = false;
          }
        } else if (subscriber.fn === handler) {
          toBeRetained = false;
        }
      }

      if (toBeRetained) {
        retain.push(subscriber);
      } else {
        removed = true;
      }
    }

    if (removed) {
      this._subscriptions[event] = retain;
    }
  }

  return this;
}

/**
 * Emits given event or events
 * @param   {String} events
 * @returns {Object}
 */

function emit (events) {
  if (!this._subscriptions) {
    return this;
  }

  var eventsList = events.split(R_SPACE);
  var args = slice.call(arguments);
  var eventsCount = eventsList.length;
  var event;
  var i = -1;
  var j;
  var subscribers;
  var subscriber;
  var subscribersCount;

  while (++i < eventsCount) {
    event = eventsList[i];

    subscribers = this._subscriptions[event] || [];
    subscribersCount = subscribers.length;
    j = -1;

    while (++j < subscribersCount) {
      args[0] = event;

      subscriber = subscribers[j];
      subscriber.fn.apply(subscriber.ctx, args);

      if (subscriber.once) {
        this.off(event, subscriber.fn, subscriber.ctx);
      }
    }
  }

  return this;
}

var api = EventEmit.prototype;

api.on      = on;
api.once    = once;
api.off     = off;
api.emit    = emit;

/**
 * Applies event emitter as mixin
 * @param  {Object} target
 * @public
 * @static
 */

function mixinTo (target) {
  target.on   = api.on;
  target.once = api.once;
  target.off  = api.off;
  target.emit = api.emit;
}

EventEmit.mixinTo = mixinTo;

module.exports = EventEmit;
