var Hub = (function () {
  var subscribers = {};

  return {
    pub: function (event) {
      return this;
    },

    reset: function () {
      subscribers = {};
      return this;
    },

    sub: function (msg, handler, context) {

      return this;
    },

    unsub: function (msg, handler) {

      return this;
    }
  }
}());