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

    // 1. Exists
    it('should exists', function () {
      expect(window.Hub).toBeDefined();
    });

    // 2. Subscribe
    describe('subscribe', function () {

      // 2.1 sub
      it('should add subscription to channel', function () {
        Hub.sub('channel_1', function () {
          __log.push('channel_1a');
        });

        Hub.sub('channel_2', function () {
          __log.push('channel_2');
        });

        Hub.sub('channel_1', function () {
          __log.push('channel_1b');
        });

        Hub.pub('channel_1');
        Hub.pub('channel_2');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('channel_1a');
        expect(__log[1]).toBe('channel_1b');
        expect(__log[2]).toBe('channel_2');
      });

      // 2.2 duplicates
      it('should prevent duplicates', function () {
        var handler = function () {
          __log.push('channel');
        };

        Hub.sub('channel', handler);
        Hub.sub('channel', handler);

        Hub.pub('channel');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('channel');
      });

      // 2.3 nested
      it('should handle nested subscribing', function () {
        Hub.sub('channel_1', function () {
          __log.push('channel_1a');

          Hub.sub('channel_1', function () {
            __log.push('channel_1b');
          });
        });

        Hub.pub('channel_1');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('channel_1a');

        __log = [];

        Hub.pub('channel_1');

        expect(__log.length).toBe(2);
        expect(__log[1]).toBe('channel_1a');
        expect(__log[2]).toBe('channel_1b');
      });

      // 2.4 context
      it('should be possible to pass context for listener', function () {
        var obj = {
          foo: 'bar',
          method: function () {
            __log.push(this.foo);
          }
        };

        Hub.sub('channel_1', obj.getFoo, obj);
        Hub.pub('channel_1');

        expect(__log.length).toBe(0);
        expect(__log[0]).toBe('bar');
      });

      // 2.5 multiple
      it('should work with multiple channels', function () {
        Hub.sub('channel_1 channel2', function () {
          __log.push('handler_1');
        });

        Hub.sub(' channel_2   channel3 ', function () {
          __log.push('handler_2');
        });

        Hub.pub('channel_1');
        Hub.pub('channel_2');
        Hub.pub('channel_3');

        expect(__log.length).toBe(4);
        expect(__log[0]).toBe('handler_1');
        expect(__log[1]).toBe('handler_1');
        expect(__log[2]).toBe('handler_2');
        expect(__log[3]).toBe('handler_2');
      });

      // 2.6 namespace
      xit('should work with namespace', function () {
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

      // 2.7 warn
      it('should warn on attempt to subscribe with empty channel name', function() {
        console.warn = function () {
          __log.push('warning');
        };

        Hub.sub();
        Hub.sub('');
        Hub.sub('  ');
        Hub.sub(1);
        Hub.sub(null);
        Hub.sub(undefined);

        expect(__log.length).toBe(6);
        expect(__log[0]).toBe('warning');
        expect(__log[1]).toBe('warning');
        expect(__log[2]).toBe('warning');
        expect(__log[3]).toBe('warning');
        expect(__log[4]).toBe('warning');
        expect(__log[5]).toBe('warning');
      });
    });

    // 3. Unsubscribe
    describe('unsubscribe', function () {

      // 3.1 unsub
      it('should remove channel listener', function () {
        var handler_1a = function () {
          __log.push('channel_1a');
        };

        var handler_1b = function () {
          __log.push('channel_1b');
        };

        var handler_2 = function () {
          __log.push('channel_2');
        };

        var handler_3 = function () {
          __log.push('channel_3');
        };

        var handler_4a = function () {
          __log.push('channel_4a');
        };

        var handler_4b = function () {
          __log.push('channel_4b');
        };

        Hub.sub('channel_1', handler_1a);
        Hub.sub('channel_1', handler_1b);
        Hub.sub('channel_2', handler_2);
        Hub.sub('channel_3', handler_3);
        Hub.sub('channel_4', handler_4a);
        Hub.sub('channel_4', handler_4b);

        Hub.unsub('channel_1', handler_1a);
        Hub.unsub('channel_1', handler_1a); // repeated unsub
        Hub.unsub('channel_2', handler_1a); // wrong handler
        Hub.unsub('channel_4'); // unsub all

        Hub.pub('channel_1');
        Hub.pub('channel_2');
        Hub.pub('channel_3');
        Hub.pub('channel_4');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('channel_1b');
        expect(__log[1]).toBe('channel_2');
        expect(__log[2]).toBe('channel_3');
      });

      // 3.2 nested
      it('should work correctly in nested subscriptions', function () {
        var handler_1a = function () {
          __log.push('channel_1a');
          Hub.unsub('channel_1', handler_1b);
        };

        var handler_1b = function () {
          __log.push('channel_1b');
        };

        Hub.sub('channel_1', handler_1a);
        Hub.sub('channel_1', handler_1b);

        Hub.pub('channel_1');
        Hub.pub('channel_1');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('channel_1a');
        expect(__log[1]).toBe('channel_1b');
        expect(__log[2]).toBe('channel_1a');
      });

      // 3.3 multiple
      it('should support multiple channels', function () {
        Hub.sub('channel_1', function () {
          __log.push('channel_1');
        });

        Hub.sub('channel_2', function () {
          __log.push('channel_2');
        });

        Hub.sub('channel_3', function () {
          __log.push('channel_3');
        });

        Hub.sub('channel_4', function () {
          __log.push('channel_4');
        });

        Hub.unsub('  channel_1    channel_3');

        Hub.pub('channel_1');
        Hub.pub('channel_2');
        Hub.pub('channel_3');
        Hub.pub('channel_4');

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe('channel_2');
        expect(__log[1]).toBe('channel_4');
      });

      // 3.4 namespace
      xit('should support namespaces', function () {
        //
      });
    });

    // 4. Publish
    describe('publish', function () {

      // 4.1 order
      it('should notify subscribers in proper order', function () {
        Hub.pub('channel');

        Hub.sub('channel', function (msg) {
          __log.push('0');
        });

        Hub.sub('channel', function (msg) {
          __log.push('1');
        });

        Hub.pub('channel');

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe(0);
        expect(__log[1]).toBe(1);
      });

      // 4.2 multiple
      it('should support multiple channels', function () {
        Hub.sub('channel_1', function () {
          __log.push('channel_1');
        });

        Hub.sub('channel_2', function () {
          __log.push('channel_2');
        });

        Hub.sub('channel_3', function () {
          __log.push('channel_3');
        });

        Hub.sub('channel_4', function () {
          __log.push('channel_4');
        });

        Hub.pub(' channel_2  channel_1  channel_4 ');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('channel_2');
        expect(__log[1]).toBe('channel_1');
        expect(__log[2]).toBe('channel_4');
      });

      // 4.3 channel name as argument
      it('should pass channel name as a first argument', function () {
        var handler = function (channel) {
          __log.push(channel);
        };

        Hub.sub('channel_1', handler);
        Hub.pub('channel_1');

        expect(__log.length).toBe(0);
        expect(__log[0]).toBe('channel_1');

        __log = [];

        Hub.sub('channel_2', handler);
        Hub.sub('channel_2/ns1', handler);
        Hub.sub('channel_2/ns2', handler);

        Hub.pub('channel_2/ns1');
        Hub.pub('channel_2/ns2');
        Hub.pub('channel_2');

        expect(__log.length).toBe(5);
        expect(__log[0]).toBe('channel_2/ns1');
        expect(__log[1]).toBe('channel_2/ns1');
        expect(__log[2]).toBe('channel_2/ns2');
        expect(__log[3]).toBe('channel_2/ns2');
        expect(__log[4]).toBe('channel_2');

        __log = [];

        Hub.sub('channel_3', handler);
        Hub.sub('channel_4', handler);
        Hub.sub('channel_5', handler);

        Hub.pub('channel_3 channel_5 channel_4');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('channel_3');
        expect(__log[1]).toBe('channel_4');
        expect(__log[2]).toBe('channel_5');
      });

      // 4.4 data
      it('should be possible pass data to publication', function () {
        var data = { foo: 'bar' };
        var moreData = 'data string';

        Hub.sub('channel_1', function (msg, data, moreData) {
          __log.push(data);
          __log.push(moreData);
        });

        Hub.pub('channel_1', data, moreData);

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe(data);
        expect(__log[1]).toBe(moreData);
      });

      // 4.5 warning
      it('should warn on attempt to publish with empty channel name', function() {
        console.warn = function () {
          __log.push('warning');
        };

        Hub.pub();
        Hub.pub('');
        Hub.pub('  ');
        Hub.pub(1);
        Hub.pub(null);
        Hub.pub(undefined);

        expect(__log.length).toBe(6);
        expect(__log[0]).toBe('warning');
        expect(__log[1]).toBe('warning');
        expect(__log[2]).toBe('warning');
        expect(__log[3]).toBe('warning');
        expect(__log[4]).toBe('warning');
        expect(__log[5]).toBe('warning');
      });
    });

    // 5. Reset
    describe('reset', function () {

      // 5.1 clear
      it('should remove all subscriptions', function () {
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

    // 6. Chaining
    describe('chaining', function () {

      // 6.1 return instance
      it('should return Hub instance for chaining in api call', function () {
        expect(Hub.sub('channel', function () {})).toBe(Hub);
        expect(Hub.unsub('channel')).toBe(Hub);
        expect(Hub.pub('channel')).toBe(Hub);
        expect(Hub.reset()).toBe(Hub);
      });
    });
  });
}());