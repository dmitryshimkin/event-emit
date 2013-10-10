(function () {
  'use strict';

  /**
   * Hub
   */
  
  var Hub = (function (undefined) {
    var console = window.console;
    var subscribers = {};
    var api = {};
  
    api['pub'] = function (msg) {
      console.log(msg);
      return this;
    };
  
    api['reset'] = function () {
      subscribers = {};
      return this;
    };
  
    api['sub'] =  function (msg, handler, context) {
      console.log(msg, handler, context);
      return this;
    };
  
    api['unsub'] = function (msg, handler) {
      console.log(msg, handler);
      return this;
    };
  
    return api;
  }());
  
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