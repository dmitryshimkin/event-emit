'use strict';

/**
 * Hub
 * @public
 */

var Hub = {};

Hub.on = Mixin.event.on;
Hub.once = Mixin.event.once;
Hub.off = Mixin.event.off;
Hub.trigger = Mixin.event.trigger;

/**
 * @TBD
 * @returns {Hub}
 */

Hub.reset = function () {
  this._subscriptions = {};
  return this;
};
