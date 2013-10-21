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
  messages = trim(messages).split(rSplit);

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
  messages = trim(messages).split(rSplit);

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

Hub['unsub'] = function (messages, handler) {
  messages = trim(messages).split(rSplit);

  var messagesCount = messages[length];
  var message;
  var i = -1;

  var j, subscribers, subscriber, subscribersCount;
  var retain;

  while (++i < messagesCount) {
    message = messages[i];

    subscribers = subscriptions[message] || [];
    subscribersCount = subscribers[length];
    j = -1;

    retain = [];

    if (handler !== undefined) {
      while (++j < subscribersCount) {
        subscriber = subscribers[j];
        if (subscriber.fn !== handler) {
          retain.push(subscriber);
        }
      }
      subscriptions[message] = retain;
    } else {
      subscriptions[message] = [];
    }
  }

  return this;
};