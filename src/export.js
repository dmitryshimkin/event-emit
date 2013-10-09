if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = Hub;
} else {
  if (typeof define === 'function' && define.amd) {
    define('Hub', [], function () {
      return Hub;
    });
  }
}

if (typeof window === 'object') {
  window.Hub = Hub;
}