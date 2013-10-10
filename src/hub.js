var subscriptions = {};
var rSplit = /\s+/;
var clean = function () {
  //
};

/**
 * Hub
 * @public
 */

var Hub = {};

Hub['pub'] = function (channel) {
  var subscribers = subscriptions[channel] || [];
  var subscriber;
  var l = subscribers.length;
  var i = -1;

  while (++i < l) {
    subscriber = subscribers[i];
    if (subscriber !== undefined) {
      subscriber.handler.apply(subscriber.context, arguments);
    }
  }

  return this;
};

Hub['reset'] = function () {
  subscriptions = {};
  return this;
};

Hub['sub'] =  function (channels, handler, context) {
  channels = trim(channels).split(rSplit);

  var channel;
  var l = channels.length;
  var i = -1;

  while (++i < l) {
    channel = channels[i];
    subscriptions[channel] = subscriptions[channel] || [];
    subscriptions[channel].push({
      handler: handler,
      context: context
    });
  }

  return this;
};

Hub['unsub'] = function (channel, handler) {
  var subscribers = subscriptions[channel] || [];
  var subscriber;
  var l = subscribers.length;
  var i = -1;

  if (handler !== undefined) {
    while (++i < l) {
      subscriber = subscribers[i];
      if (subscriber !== undefined && subscriber.handler === handler) {
        subscribers[i] = undefined;
        return this;
      }
    }
  } else {
    subscriptions[channel].length = 0;
  }

  return this;
};