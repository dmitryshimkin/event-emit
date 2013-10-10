var subscriptions = {};

var clean = function () {
  //
};

/**
 * Hub
 * @public
 */

var Hub = {};

Hub['pub'] = function (msg) {
  var subscribers = subscriptions[msg] || [];
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

Hub['sub'] =  function (msg, handler, context) {
  subscriptions[msg] = subscriptions[msg] || [];
  subscriptions[msg].push({
    handler: handler,
    context: context
  });
  return this;
};

Hub['unsub'] = function (msg, handler) {
  var subscribers = subscriptions[msg] || [];
  var subscriber;
  var l = subscribers.length;
  var i = -1;

  while (++i < l) {
    subscriber = subscribers[i];
    if (subscriber !== undefined && subscriber.handler === handler) {
      subscribers[i] = undefined;
      return this;
    }
  }

  return this;
};