(function (undefined) {
  'use strict';

  var Lang = {};
  
  /**
   * Trim string
   * @param str {String} String to be trimmed
   * @return {String} Trimmed string
   * @public
   */
  
  Lang.trim = function (str) {
    return str.replace(Lang.trim.r, '');
  };
  
  Lang.trim.r = /^\s+|\s+$/g;
  
  var Mixin = {};
  
  var rSplit = /\s+/;
  var slice = Array.prototype.slice;
  var length = 'length';
  
  Mixin.event = {
    /**
     * @TBD
     * @param messages {String}
     * @param handler {Function}
     * @param [context] {Object}
     * @returns {Object}
     */
  
    on: function (messages, handler, context) {
      if (!this._subscriptions) {
        this._subscriptions = {};
      }
  
      messages = Lang.trim(messages).split(rSplit);
  
      var messagesCount = messages[length];
      var message;
      var i = -1;
  
      while (++i < messagesCount) {
        message = messages[i];
  
        this._subscriptions[message] = this._subscriptions[message] || [];
        this._subscriptions[message].push({
          ctx: context,
          fn: handler
        });
      }
  
      return this;
    },
  
    /**
     * Removes subscription
     * @param messages {String}
     * @param handler {Function}
     * @param [ctx] {Object}
     * @returns {Hub}
     */
  
    off: function (messages, handler, ctx) {
      if (!this._subscriptions) {
        return this;
      }
  
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
  
        subscribers = this._subscriptions[message] || [];
        subscribersCount = subscribers[length];
  
        index = -1;
        j = -1;
  
        if (!checkHandler) {
          this._subscriptions[message] = [];
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
          this._subscriptions[message] = retain;
        }
      }
  
      return this;
    },
  
    /**
     * @TBD
     * @param messages {String}
     * @returns {Object}
     */
  
    trigger: function (messages) {
      if (!this._subscriptions) {
        return this;
      }
  
      messages = Lang.trim(messages).split(rSplit);
  
      var args = slice.call(arguments);
  
      var messagesCount = messages[length];
      var message;
      var i = -1;
      var j;
      var subscribers;
      var subscriber;
      var subscribersCount;
  
      while (++i < messagesCount) {
        message = messages[i];
  
        subscribers = this._subscriptions[message] || [];
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
    }
  };
  
  /**
   * Hub
   * @public
   */
  
  var Hub = {};
  
  Hub.pub = Mixin.event.trigger;
  Hub.sub = Mixin.event.on;
  Hub.unsub = Mixin.event.off;
  
  /**
   * @TBD
   * @returns {Hub}
   */
  
  Hub.reset = function () {
    this._subscriptions = {};
    return this;
  };
  
  /** Export */
  
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