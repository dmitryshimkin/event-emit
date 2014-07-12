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
      subscriber.fn.apply(subscriber.ctx, args);
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
  var retain;
  var checkHandler = handler !== undefined;
  var checkContext = ctx !== undefined;

  while (++i < messagesCount) {
    message = messages[i];

    subscribers = subscriptions[message] || [];
    subscribersCount = subscribers[length];
    j = -1;

    retain = [];

    if (!checkHandler) {
      subscriptions[message] = [];
      continue;
    }

    while (++j < subscribersCount) {
      subscriber = subscribers[j];
      if (checkContext) {
        if (subscriber.fn !== handler || subscriber.ctx !== ctx) {
          retain.push(subscriber);
        }
      } else if (subscriber.fn !== handler) {
        retain.push(subscriber);
      }
    }

    subscriptions[message] = retain;
  }

  return this;
};