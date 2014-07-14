var subscriptions = {};
var rSplit = /\s+/;
var slice = Array.prototype.slice;
var length = 'length';

/**
 * Hub
 * @public
 */

var Hub = {};

Hub['pub'] = function (messages) {
  messages = Lang.trim(messages).split(rSplit);

  var args = slice.call(arguments);

  var messagesCount = messages[length];
  var message;
  var i = -1;

  var j, subscribers, subscriber, subscribersCount;

  while (++i < messagesCount) {
    message = messages[i];

    subscribers = subscriptions[message] || [];
    subscribersCount = subscribers[length];
    j = -1;

    while (++j < subscribersCount) {
      args[0] = message;
      subscriber = subscribers[j];

      if (subscriber !== undefined) {
        subscriber.fn.apply(subscriber.ctx, args);
      }
    }
  }

  return this;
};

Hub['reset'] = function () {
  subscriptions = {};
  return this;
};

Hub['sub'] = function (messages, handler, context) {
  messages = Lang.trim(messages).split(rSplit);

  var messagesCount = messages[length];
  var message;
  var i = -1;

  while (++i < messagesCount) {
    message = messages[i];

    subscriptions[message] = subscriptions[message] || [];
    subscriptions[message].push({
      ctx: context,
      fn: handler
    });
  }

  return this;
};

/**
 * Removes subscription
 * @param messages {String}
 * @param handler {Function}
 * @param [ctx] {Object}
 * @returns {Hub}
 */

Hub['unsub'] = function (messages, handler, ctx) {
  messages = Lang.trim(messages).split(rSplit);

  var messagesCount = messages[length];
  var message;
  var i = -1;
  var j;
  var subscribers;
  var subscriber;
  var subscribersCount;
  var checkHandler = handler !== undefined;
  var checkContext = ctx !== undefined;
  var index;

  var retain;
  var toBeRetained;
  var removed;

  while (++i < messagesCount) {
    message = messages[i];

    subscribers = subscriptions[message] || [];
    subscribersCount = subscribers[length];

    index = -1;
    j = -1;

    if (!checkHandler) {
      subscriptions[message] = [];
      continue;
    }

    retain = [];
    removed = false;

    for (j = 0; j < subscribersCount; j++) {
      subscriber = subscribers[j];
      toBeRetained = true;

      if (!removed) {
        if (checkContext) {
          if (subscriber.fn === handler && subscriber.ctx === ctx) {
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
      subscriptions[message] = retain;
    }
  }

  return this;
};