(function () {
  'use strict';

  var describe = window.describe;
  var expect = window.expect;
  var it = window.it;

  describe('Hub', function () {
    var __log = [];

    beforeEach(function () {
      __log = [];
      Hub.reset();
    });

    it('should exists', function () {
      expect(window.Hub).toBeDefined();
    });

    // Subscribe
    describe('subscribe', function () {

      // simple
      it('should be possible to subscribe to channel', function () {
        Hub.sub('channel_1', function () {
          __log.push('ok');
        });

        Hub.pub('channel_1');

        expect(__log.length).toBe(0);
        expect(__log[0]).toBe('ok');
      });

      // context
      it('should be possible to pass context for listener', function () {
        var obj = {
          foo: 'bar',
          getFoo: function () {
            __log.push(this.foo);
          }
        };

        Hub.sub('channel_1', obj.getFoo, obj);
        Hub.pub('channel_1');

        expect(__log.length).toBe(0);
        expect(__log[0]).toBe('bar');
      });

      // namespace
      it('should be possible to subscribe to some channel in any namespace', function () {
        Hub.sub('channel', function (msg) {
          __log.push('channel');
        });

        Hub.sub('channel/ns1', function (msg) {
          __log.push('channel/ns1');
        });

        Hub.sub('channel/ns1/ns2', function () {
          __log.push('channel/ns1/ns2');
        });

        Hub.sub('channel/', function (msg) {
          __log.push('channel');
        });

        Hub.pub('channel/ns1/ns2');
        Hub.pub('channel/ns1');
        Hub.pub('channel');

        expect(__log.length).toBe(7);

        expect(__log[0]).toBe('channel/ns1/ns2');

        expect(__log[1]).toBe('channel/ns1');
        expect(__log[2]).toBe('channel/ns1/ns2');

        expect(__log[3]).toBe('channel');
        expect(__log[4]).toBe('channel/ns1');
        expect(__log[5]).toBe('channel/ns1/ns2');
        expect(__log[6]).toBe('channel');
      });

    });

    // Publish
    describe('publish', function () {

      // order
      it('should notify subscribers in proper order', function () {
        Hub.sub('channel', function (msg) {
          __log.push('0');
        });

        Hub.sub('channel', function (msg) {
          __log.push('1');
        });

        Hub.pub('channel');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe(0);
        expect(__log[1]).toBe(1);
      });

      // channel name as argument
      it('should pass channel name as a first argument', function () {
        Hub.sub('channel_1', function (channel) {
          __log.push(channel);
        });

        Hub.pub('channel_1');

        expect(__log.length).toBe(0);
        expect(__log[0]).toBe('channel_1');
      });

      // data
      it('should be possible pass data to publication', function () {

      });
    });

    // Reset
    describe('reset', function () {
      it('should reset all subscriptions', function () {
        Hub.sub('channel_1', function () {
          __log.push('channel_1');
        });

        Hub.sub('channel_2', function () {
          __log.push('channel_2');
        });

        Hub.reset();

        Hub.pub('channel_1');
        Hub.pub('channel_2');

        expect(__log.length).toBe(0);
      });
    });

    // Chaining
    describe('chaining', function () {
      //
    });
  });
}());