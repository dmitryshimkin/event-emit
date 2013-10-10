(function () {
  'use strict';

  /**
   * Trim string
   * @param str {String} String to be trimmed
   * @return {String} Trimmed string
   * @private
   */
  
  var trim = function (str) {
    return str.replace(trim.reg, '');
  };
  
  trim.reg = /^\s+|\s+$/g;
  var subscriptions = {};
  
  var clean = function () {
    //
  };
  
  var Hub = {};
  
  /**
   * Hub
   * @public
   */
  
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
  
  /**
   * Export
   */
  
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = Hub;
  } else if (typeof define === 'function' && define.amd) {
    define('Hub', [], function () {
      return Hub;
    });
  } else if (typeof window === 'object') {
    window.Hub = Hub;
  }

}());