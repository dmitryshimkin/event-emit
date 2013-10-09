(function () {
  'use strict';

  var describe = window.describe;
  var expect = window.expect;
  var it = window.it;
  var beforeEach = window.beforeEach;

  describe('Hub', function () {
    var __log = [];

    beforeEach(function () {
      __log = [];
    });

    it('should exists', function () {
      expect(window.Hub).toBeDefined();
    });
  });
}());