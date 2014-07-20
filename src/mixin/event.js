'use strict';

var slice = Array.prototype.slice;
var R_SPACE = /\s+/;

Mixin.event = {
  /**
   * @TBD
   * @param events {String}
   * @param handler {Function}
   * @param [context] {Object}
   * @param [once] {Boolean}
   * @returns {Object}
   */

  on: function (events, handler, context, once) {
    var all = this._subscriptions;
    var eventsList = events.split(R_SPACE);
    var event;
    var i = eventsList.length;
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
        once: !!once
      });
    }

    return this;
  },

  /**
   * @TBD
   * @param events {String}
   * @param handler {Function}
   * @param [context] {Object}
   * @returns {Object}
   */

  once: function (events, handler, context) {
    return this.on(events, handler, context, true);
  },

  /**
   * Removes subscription
   * @param events {String}
   * @param handler {Function}
   * @param [context] {Object}
   * @returns {Hub}
   */

  off: function (events, handler, context) {
    if (!this._subscriptions) {
      return this;
    }

    events = events.split(R_SPACE);

    var eventsCount = events.length;
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
      event = events[i];

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
  },

  /**
   * @TBD
   * @param events {String}
   * @returns {Object}
   */

  trigger: function (events) {
    if (!this._subscriptions) {
      return this;
    }

    events = events.split(R_SPACE);

    var args = slice.call(arguments);

    var eventsCount = events.length;
    var event;
    var i = -1;
    var j;
    var subscribers;
    var subscriber;
    var subscribersCount;

    while (++i < eventsCount) {
      event = events[i];

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
};
