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

    it('1. Exists', function () {
      expect(window.Hub).toBeDefined();
    });

    describe('2. Subscribe', function () {
      it('2.1. on', function () {
        Hub.on('message_1', function () {
          __log.push('message_1a');
        });

        Hub.on('message_2', function () {
          __log.push('message_2');
        });

        Hub.on('message_1', function () {
          __log.push('message_1b');
        });

        Hub.trigger('message_1');
        Hub.trigger('message_2');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('message_1a');
        expect(__log[1]).toBe('message_1b');
        expect(__log[2]).toBe('message_2');
      });

      it('2.2. nested on', function () {
        Hub.on('message_1', function () {
          __log.push('message_1a');

          Hub.on('message_1', function () {
            __log.push('message_1b');
          });
        });

        Hub.trigger('message_1');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('message_1a');

        __log = [];

        Hub.trigger('message_1');

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe('message_1a');
        expect(__log[1]).toBe('message_1b');
      });

      it('2.3. on with context', function () {
        var obj = {
          foo: 'bar',
          getFoo: function () {
            __log.push(this.foo);
          }
        };

        Hub.on('message_1', obj.getFoo, obj);
        Hub.trigger('message_1');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('bar');
      });

      it('2.4. multiple messages on', function () {
        Hub.on('message_1 message_2', function () {
          __log.push('handler_1');
        });

        Hub.on(' message_2   message_3 ', function () {
          __log.push('handler_2');
        });

        Hub.trigger('message_1');
        Hub.trigger('message_2');
        Hub.trigger('message_3');

        expect(__log.length).toBe(4);
        expect(__log[0]).toBe('handler_1');
        expect(__log[1]).toBe('handler_1');
        expect(__log[2]).toBe('handler_2');
        expect(__log[3]).toBe('handler_2');
      });
    });

    describe('3. Unsubscribe', function () {
      it('3.1. off', function () {
        var handler_1a = function handler1a () {
          __log.push('message_1a');
        };

        var handler_1b = function handler1b () {
          __log.push('message_1b');
        };

        var handler_2 = function handler2 () {
          __log.push('message_2');
        };

        var handler_3 = function handler3 () {
          __log.push('message_3');
        };

        var handler_4a = function handler4a () {
          __log.push('message_4a');
        };

        var handler_4b = function handler4b () {
          __log.push('message_4b');
        };

        Hub.off('message_3'); // off before on

        Hub.on('message_1', handler_1a);
        Hub.on('message_1', handler_1a);
        Hub.on('message_1', handler_1a); // Repeated on
        Hub.on('message_1', handler_1b);
        Hub.on('message_2', handler_2);
        Hub.on('message_3', handler_3);
        Hub.on('message_4', handler_4a);
        Hub.on('message_4', handler_4b);

        Hub.off('message_1', handler_1a);
        Hub.off('message_1', handler_1a); // repeated off
        Hub.off('message_2', handler_1a); // wrong handler
        Hub.off('message_4'); // off all

        Hub.trigger('message_1');
        Hub.trigger('message_2');
        Hub.trigger('message_3');
        Hub.trigger('message_4');

        expect(__log.length).toBe(4);
        expect(__log[0]).toBe('message_1a');
        expect(__log[1]).toBe('message_1b');
        expect(__log[2]).toBe('message_2');
        expect(__log[3]).toBe('message_3');
      });

      it('3.2. nested off', function () {
        var handler_1a = function handler1a() {
          __log.push('message_1a');
          Hub.off('message_1', handler_1b);
        };

        var handler_1b = function handler1b() {
          __log.push('message_1b');
        };

        Hub.on('message_1', handler_1a);
        Hub.on('message_1', handler_1b);

        Hub.trigger('message_1');
        Hub.trigger('message_1');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('message_1a');
        expect(__log[1]).toBe('message_1b');
        expect(__log[2]).toBe('message_1a');
      });

      it('3.3. multiple messages off', function () {
        Hub.on('message_1', function () {
          __log.push('message_1');
        });

        Hub.on('message_2', function () {
          __log.push('message_2');
        });

        Hub.on('message_3', function () {
          __log.push('message_3');
        });

        Hub.on('message_4', function () {
          __log.push('message_4');
        });

        Hub.off('  message_1    message_3');

        Hub.trigger('message_1');
        Hub.trigger('message_2');
        Hub.trigger('message_3');
        Hub.trigger('message_4');

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe('message_2');
        expect(__log[1]).toBe('message_4');
      });

      it('3.4. off by handler and context', function () {
        var handler = function () {
          __log.push(this.id);
        };
        var ctx1 = {
          id: '1'
        };
        var ctx2 = {
          id: '2'
        };

        Hub.on('message', handler, ctx1);
        Hub.on('message', handler, ctx2);

        Hub.trigger('message');

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe('1');
        expect(__log[1]).toBe('2');

        Hub.off('message', handler, ctx1);

        __log.length = 0;

        Hub.trigger('message');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('2');
      });

      it('3.5. equal handlers off', function () {
        var handler = function () {
          __log.push('ok');
        };

        Hub.on('event', handler);
        Hub.on('event', handler);
        Hub.trigger('event');

        expect(__log.length).toBe(2);

        __log.length = 0;

        Hub.off('event', handler);
        Hub.trigger('event');

        expect(__log.length).toBe(1);
      });
    });

    describe('4. Publish', function () {
      it('4.1. order', function () {
        Hub.trigger('message');

        Hub.on('message', function () {
          __log.push(1);
        });

        Hub.on('message', function () {
          __log.push(2);
        });

        Hub.trigger('message');

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe(1);
        expect(__log[1]).toBe(2);
      });

      it('4.2. trigger multiple messages', function () {
        Hub.on('message_1', function () {
          __log.push('message_1');
        });

        Hub.on('message_2', function () {
          __log.push('message_2');
        });

        Hub.on('message_3', function () {
          __log.push('message_3');
        });

        Hub.on('message_4', function () {
          __log.push('message_4');
        });

        Hub.trigger(' message_2  message_1  message_4 ');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('message_2');
        expect(__log[1]).toBe('message_1');
        expect(__log[2]).toBe('message_4');
      });

      it('4.3. message name in first argument', function () {
        var handler = function (message) {
          __log.push(message);
        };

        Hub.on('message_1', handler);
        Hub.trigger('message_1');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('message_1');

        __log = [];

        Hub.on('message_3', handler);
        Hub.on('message_4', handler);
        Hub.on('message_5', handler);

        Hub.trigger('message_3 message_5 message_4');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('message_3');
        expect(__log[1]).toBe('message_5');
        expect(__log[2]).toBe('message_4');
      });

      it('4.4. pass data', function () {
        var data = { foo: 'bar' };
        var moreData = 'data string';

        Hub.on('message_1', function (msg, data, moreData) {
          __log.push(data);
          __log.push(moreData);
        });

        Hub.trigger('message_1', data, moreData);

        expect(__log.length).toBe(2);
        expect(__log[0]).toBe(data);
        expect(__log[1]).toBe(moreData);
      });
    });

    describe('5. Once', function () {
      it('5.1. sub', function () {
        Hub.once('message_1', function () {
          __log.push('message_1a');
        });

        Hub.once('message_2', function () {
          __log.push('message_2');
        });

        Hub.once('message_1', function () {
          __log.push('message_1b');
        });

        Hub.trigger('message_1');
        Hub.trigger('message_2');

        Hub.trigger('message_1');
        Hub.trigger('message_2');

        Hub.trigger('message_1');
        Hub.trigger('message_2');

        expect(__log.length).toBe(3);
        expect(__log[0]).toBe('message_1a');
        expect(__log[1]).toBe('message_1b');
        expect(__log[2]).toBe('message_2');
      });

      it('5.2. nested once', function () {
        Hub.once('message_1', function () {
          __log.push('message_1a');

          Hub.once('message_1', function () {
            __log.push('message_1b');
          });
        });

        Hub.trigger('message_1');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('message_1a');

        __log = [];

        Hub.trigger('message_1');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('message_1b');

        __log = [];

        Hub.trigger('message_1');

        expect(__log.length).toBe(0);
      });

      it('5.3. once with context', function () {
        var obj = {
          foo: 'bar',
          getFoo: function () {
            __log.push(this.foo);
          }
        };

        Hub.once('message_1', obj.getFoo, obj);
        Hub.trigger('message_1');
        Hub.trigger('message_1');

        expect(__log.length).toBe(1);
        expect(__log[0]).toBe('bar');
      });

      it('5.4. multiple messages sub', function () {
        Hub.once('message_1 message_2', function () {
          __log.push('handler_1');
        });

        Hub.once(' message_2   message_3 ', function () {
          __log.push('handler_2');
        });

        Hub.trigger('message_1');
        Hub.trigger('message_2');
        Hub.trigger('message_3');

        expect(__log.length).toBe(4);
        expect(__log[0]).toBe('handler_1');
        expect(__log[1]).toBe('handler_1');
        expect(__log[2]).toBe('handler_2');
        expect(__log[3]).toBe('handler_2');

        __log = [];

        Hub.trigger('message_1');
        Hub.trigger('message_2');
        Hub.trigger('message_3');

        expect(__log.length).toBe(0);
      });
    });

    describe('6. Reset', function () {
      it('6.1. remove all subscriptions', function () {
        Hub.on('message_1', function () {
          __log.push('message_1');
        });

        Hub.on('message_2', function () {
          __log.push('message_2');
        });

        Hub.reset();

        Hub.trigger('message_1');
        Hub.trigger('message_2');

        expect(__log.length).toBe(0);
      });
    });

    describe('7. Chaining', function () {
      it('7.1. return Hub instance', function () {
        expect(Hub.on('message', function () {})).toBe(Hub);
        expect(Hub.off('message')).toBe(Hub);
        expect(Hub.trigger('message')).toBe(Hub);
        expect(Hub.reset()).toBe(Hub);
      });
    });
  });
}());
