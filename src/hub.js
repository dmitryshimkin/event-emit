'use strict';

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
