
/**
 * Export
 */

var obj = 'object';

if (typeof module === obj && typeof module.exports === obj) {
  module.exports = Hub;
} else if (typeof define === 'function' && define.amd) {
  define('Hub', [], function () {
    return Hub;
  });
} else if (typeof window === obj) {
  window['Hub'] = Hub;
}