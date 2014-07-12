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
      it('should add subscription to message', function () {
        Hub.sub('message_1', function () {
          __log.push('message_1a');
        });

        Hub.sub('message_2', function () {
          __log.push('message_2');
        });

        Hub.sub('message_1', function () {
          __log.push('message_1b');
        });

        Hub.pub('message_1');
        Hub.pub('message_2');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('message_1a');
        expect(__log[1]).toBe('message_1b');
        expect(__log[2]).toBe('message_2');
      });

      // 2.2 nested
      it('should handle nested subscribing', function () {
        Hub.sub('message_1', function () {
          __log.push('message_1a');

          Hub.sub('message_1', function () {
            __log.push('message_1b');
          });
        });

        Hub.pub('message_1');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('message_1a');

        __log = [];

        Hub.pub('message_1');

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe('message_1a');
        expect(__log[1]).toBe('message_1b');
      });

      // 2.3 context
      it('should be possible to pass context for listener', function () {
        var obj = {
          foo: 'bar',
          getFoo: function () {
            __log.push(this.foo);
          }
        };

        Hub.sub('message_1', obj.getFoo, obj);
        Hub.pub('message_1');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('bar');
      });

      // 2.4 multiple
      it('should work with multiple messages', function () {
        Hub.sub('message_1 message_2', function () {
          __log.push('handler_1');
        });

        Hub.sub(' message_2   message_3 ', function () {
          __log.push('handler_2');
        });

        Hub.pub('message_1');
        Hub.pub('message_2');
        Hub.pub('message_3');

        expect(__log.length).toBe(4);
        expect(__log[0]).toBe('handler_1');
        expect(__log[1]).toBe('handler_1');
        expect(__log[2]).toBe('handler_2');
        expect(__log[3]).toBe('handler_2');
      });
    });

    // 3. Unsubscribe
    describe('unsubscribe', function () {

      // 3.1 unsub
      it('should remove message listener', function () {
        var handler_1a = function () {
          __log.push('message_1a');
        };

        var handler_1b = function () {
          __log.push('message_1b');
        };

        var handler_2 = function () {
          __log.push('message_2');
        };

        var handler_3 = function () {
          __log.push('message_3');
        };

        var handler_4a = function () {
          __log.push('message_4a');
        };

        var handler_4b = function () {
          __log.push('message_4b');
        };

        Hub.unsub('message_3'); // unsub before sub

        Hub.sub('message_1', handler_1a);
        Hub.sub('message_1', handler_1b);
        Hub.sub('message_2', handler_2);
        Hub.sub('message_3', handler_3);
        Hub.sub('message_4', handler_4a);
        Hub.sub('message_4', handler_4b);

        Hub.unsub('message_1', handler_1a);
        Hub.unsub('message_1', handler_1a); // repeated unsub
        Hub.unsub('message_2', handler_1a); // wrong handler
        Hub.unsub('message_4'); // unsub all

        Hub.pub('message_1');
        Hub.pub('message_2');
        Hub.pub('message_3');
        Hub.pub('message_4');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('message_1b');
        expect(__log[1]).toBe('message_2');
        expect(__log[2]).toBe('message_3');
      });

      // 3.2 nested
      it('should work correctly in nested subscriptions', function () {
        var handler_1a = function () {
          __log.push('message_1a');
          Hub.unsub('message_1', handler_1b);
        };

        var handler_1b = function () {
          __log.push('message_1b');
        };

        Hub.sub('message_1', handler_1a);
        Hub.sub('message_1', handler_1b);

        Hub.pub('message_1');
        Hub.pub('message_1');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('message_1a');
        expect(__log[1]).toBe('message_1b');
        expect(__log[2]).toBe('message_1a');
      });

      // 3.3 multiple
      it('should support multiple messages', function () {
        Hub.sub('message_1', function () {
          __log.push('message_1');
        });

        Hub.sub('message_2', function () {
          __log.push('message_2');
        });

        Hub.sub('message_3', function () {
          __log.push('message_3');
        });

        Hub.sub('message_4', function () {
          __log.push('message_4');
        });

        Hub.unsub('  message_1    message_3');

        Hub.pub('message_1');
        Hub.pub('message_2');
        Hub.pub('message_3');
        Hub.pub('message_4');

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe('message_2');
        expect(__log[1]).toBe('message_4');
      });

      // 3.4 context
      it('should remove subscription by handler and context', function () {
        var handler = function () {
          __log.push(this.id);
        };
        var ctx1 = {
          id: '1'
        };
        var ctx2 = {
          id: '2'
        };

        Hub.sub('message', handler, ctx1);
        Hub.sub('message', handler, ctx2);

        Hub.pub('message');

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe('1');
        expect(__log[1]).toBe('2');

        Hub.unsub('message', handler, ctx1);

        __log.length = 0;

        Hub.pub('message');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('2');
      });

      // 3.5 the same handler
      it('equal handlers', function () {
        var handler = function () {
          __log.push('ok');
        };

        Hub.sub('event', handler);
        Hub.sub('event', handler);
        Hub.pub('event');

        expect(__log.length).toBe(2);

        __log.length = 0;

        Hub.unsub('event', handler);
        Hub.pub('event');

        expect(__log.length).toBe(1);
      });
    });

    // 4. Publish
    describe('publish', function () {

      // 4.1 order
      it('should notify subscribers in proper order', function () {
        Hub.pub('message');

        Hub.sub('message', function () {
          __log.push(1);
        });

        Hub.sub('message', function () {
          __log.push(2);
        });

        Hub.pub('message');

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe(1);
        expect(__log[1]).toBe(2);
      });

      // 4.2 multiple
      it('should support multiple messages', function () {
        Hub.sub('message_1', function () {
          __log.push('message_1');
        });

        Hub.sub('message_2', function () {
          __log.push('message_2');
        });

        Hub.sub('message_3', function () {
          __log.push('message_3');
        });

        Hub.sub('message_4', function () {
          __log.push('message_4');
        });

        Hub.pub(' message_2  message_1  message_4 ');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('message_2');
        expect(__log[1]).toBe('message_1');
        expect(__log[2]).toBe('message_4');
      });

      // 4.3 message name as argument
      it('should pass message name as a first argument', function () {
        var handler = function (message) {
          __log.push(message);
        };

        Hub.sub('message_1', handler);
        Hub.pub('message_1');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('message_1');

        __log = [];

        Hub.sub('message_3', handler);
        Hub.sub('message_4', handler);
        Hub.sub('message_5', handler);

        Hub.pub('message_3 message_5 message_4');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('message_3');
        expect(__log[1]).toBe('message_5');
        expect(__log[2]).toBe('message_4');
      });

      // 4.4 data
      it('should be possible pass data to publication', function () {
        var data = { foo: 'bar' };
        var moreData = 'data string';

        Hub.sub('message_1', function (msg, data, moreData) {
          __log.push(data);
          __log.push(moreData);
        });

        Hub.pub('message_1', data, moreData);

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe(data);
        expect(__log[1]).toBe(moreData);
      });
    });

    // 5. Reset
    describe('reset', function () {

      // 5.1 clear
      it('should remove all subscriptions', function () {
        Hub.sub('message_1', function () {
          __log.push('message_1');
        });

        Hub.sub('message_2', function () {
          __log.push('message_2');
        });

        Hub.reset();

        Hub.pub('message_1');
        Hub.pub('message_2');

        expect(__log.length).toBe(0);
      });
    });

    // 6. Chaining
    describe('chaining', function () {

      // 6.1 return instance
      it('should return Hub instance for chaining in api call', function () {
        expect(Hub.sub('message', function () {})).toBe(Hub);
        expect(Hub.unsub('message')).toBe(Hub);
        expect(Hub.pub('message')).toBe(Hub);
        expect(Hub.reset()).toBe(Hub);
      });
    });
  });
}());