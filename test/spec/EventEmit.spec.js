'use strict';

const EventEmit = require('../../dist/event-emit');

describe('event-emit', function () {
  var log;
  var ee;

  function noop () {}

  function resetLog () {
    log = [];
  }

  function writeLog (msg) {
    log.push(msg);
  }

  function writeLogFn (msg) {
    return function () {
      writeLog(msg)
    }
  }

  beforeEach(function () {
    ee = new EventEmit();
    log = []
  });

  describe('Class', function () {
    it('should exist', function () {
      expect(typeof EventEmit).toBe('function');
    })
  });

  describe('Static methods', function () {
    describe('mixinTo', function () {
      it('should mixin event emitter to given object', function () {
        var obj = {};

        EventEmit.mixinTo(obj);

        expect(obj.off).toBe(EventEmit.prototype.off);
        expect(obj.on).toBe(EventEmit.prototype.on);
        expect(obj.once).toBe(EventEmit.prototype.once);
        expect(obj.emit).toBe(EventEmit.prototype.emit);
      })
    })
  });

  describe('Instance method', function () {
    describe('on', function () {
      it('should subscribe to event', function () {
        ee.on('event_1', writeLogFn('event_1a'));
        ee.on('event_2', writeLogFn('event_2'));
        ee.on('event_1', writeLogFn('event_1b'));

        ee.emit('event_1');
        ee.emit('event_2');

        expect(log).toEqual([
          'event_1a',
          'event_1b',
          'event_2'
        ]);
      });

      it('should handle nested calls properly', function () {
        ee.on('event_1', function () {
          writeLog('event_1a');
          ee.on('event_1', writeLogFn('event_1b'));
        });

        ee.emit('event_1');

        expect(log).toEqual([
          'event_1a'
        ]);

        resetLog();

        ee.emit('event_1');

        expect(log).toEqual([
          'event_1a',
          'event_1b'
        ]);
      });

      it('should support context parameter', function () {
        var obj = {
          foo: 'bar',
          getFoo: function getFoo () {
            writeLog(this.foo);
          }
        };

        ee.on('event_1', obj.getFoo, obj);
        ee.emit('event_1');

        expect(log).toEqual([
          'bar'
        ]);
      });

      it('should support multiple events', function () {
        ee.on('event_1 event_2', writeLogFn('handler_1'));
        ee.on(' event_2   event_3 ', writeLogFn('handler_2'));

        ee.emit('event_1');
        ee.emit('event_2');
        ee.emit('event_3');

        expect(log).toEqual([
          'handler_1',
          'handler_1',
          'handler_2',
          'handler_2'
        ])
      });

      it('should return instance for chaining', function () {
        expect(ee.on('event', noop)).toBe(ee);
      });
    });

    describe('off', function () {
      it('should unsubscribe from event', function () {
        function handler_1a () {
          writeLog('event_1a');
        }

        function handler_1b () {
          writeLog('event_1b');
        }

        function handler_2 () {
          writeLog('event_2');
        }

        function handler_3 () {
          writeLog('event_3');
        }

        function handler_4a () {
          writeLog('event_4a');
        }

        function handler_4b () {
          writeLog('event_4b');
        }

        ee.off('event_3');             // off before on

        ee.on('event_1', handler_1a);
        ee.on('event_1', handler_1a);
        ee.on('event_1', handler_1a);  // Repeated on
        ee.on('event_1', handler_1b);
        ee.on('event_2', handler_2);
        ee.on('event_3', handler_3);
        ee.on('event_4', handler_4a);
        ee.on('event_4', handler_4b);

        ee.off('event_1', handler_1a);
        ee.off('event_1', handler_1a); // repeated off
        ee.off('event_2', handler_1a); // wrong handler
        ee.off('event_4');             // off all

        ee.emit('event_1');
        ee.emit('event_2');
        ee.emit('event_3');
        ee.emit('event_4');

        expect(log).toEqual([
          'event_1a',
          'event_1b',
          'event_2',
          'event_3'
        ]);
      });

      it('should handle nested calls properly', function () {
        function handler_1a() {
          writeLog('event_1a');
          ee.off('event_1', handler_1b);
        }

        function handler_1b() {
          writeLog('event_1b');
        }

        ee.on('event_1', handler_1a);
        ee.on('event_1', handler_1b);

        ee.emit('event_1');
        ee.emit('event_1');

        expect(log).toEqual([
          'event_1a',
          'event_1b',
          'event_1a'
        ]);
      });

      it('should support multiple unsubscribing', function () {
        ee.on('event_1', writeLogFn('event_1'));
        ee.on('event_2', writeLogFn('event_2'));
        ee.on('event_3', writeLogFn('event_3'));
        ee.on('event_4', writeLogFn('event_4'));

        ee.off('  event_1    event_3');

        ee.emit('event_1');
        ee.emit('event_2');
        ee.emit('event_3');
        ee.emit('event_4');

        expect(log).toEqual([
          'event_2',
          'event_4'
        ]);
      });

      it('should support context parameter', function () {
        function handler () {
          var ctx = this || {};
          writeLog(ctx.id);
        }

        var ctx1 = {
          id: '1'
        };

        var ctx2 = {
          id: '2'
        };

        ee.on('event', handler);
        ee.on('event', handler, ctx1);
        ee.on('event', handler, ctx2);

        ee.emit('event');

        expect(log).toEqual([
          undefined,
          '1',
          '2'
        ]);

        ee.off('event', handler, ctx1);

        resetLog();

        ee.emit('event');

        expect(log).toEqual([
          undefined,
          '2'
        ]);
      });

      it('should support equal subscriptions', function () {
        function handler () {
          writeLog('ok');
        }

        ee.on('event', handler);
        ee.on('event', handler);
        ee.emit('event');

        expect(log).toEqual([
          'ok',
          'ok'
        ]);

        resetLog();

        ee.off('event', handler);
        ee.emit('event');

        expect(log).toEqual([
          'ok'
        ]);

        resetLog();

        ee.off('event', handler);
        ee.emit('event');

        expect(log).toEqual([]);
      });

      it('should return instance for chaining', function () {
        expect(ee.off('event')).toBe(ee);
      });
    });

    describe('emit', function () {
      it('should call handlers in the same order they have beed added', function () {
        ee.emit('event');

        ee.on('event', writeLogFn(1));
        ee.on('event', writeLogFn(2));

        ee.emit('event');

        expect(log).toEqual([1, 2]);
      });

      it('should support multiple events', function () {
        ee.on('event_1', writeLogFn('event_1'));
        ee.on('event_2', writeLogFn('event_2'));
        ee.on('event_3', writeLogFn('event_3'));
        ee.on('event_4', writeLogFn('event_4'));

        ee.emit(' event_2  event_1  event_4 ');

        expect(log).toEqual([
          'event_2',
          'event_1',
          'event_4'
        ]);
      });

      it('should pass event name as first argument to handler', function () {
        function handler (event) {
          writeLog(event);
        }

        ee.on('event_1', handler);
        ee.emit('event_1');

        expect(log).toEqual([
          'event_1'
        ]);

        resetLog();

        ee.on('event_3', handler);
        ee.on('event_4', handler);
        ee.on('event_5', handler);

        ee.emit('event_3 event_5 event_4');

        expect(log).toEqual([
          'event_3',
          'event_5',
          'event_4'
        ]);
      });

      it('should pass given data to handlers', function () {
        var foo = { foo: 'bar' };
        var bar = 'bar';
        var xyz = 2;
        var zcx = undefined;

        ee.on('event_1', function (evt, arg1) {
          expect(arguments.length).toBe(2);
          expect(arg1).toBe(foo);
        });

        ee.on('event_2', function (evt, arg1, arg2) {
          expect(arguments.length).toBe(3);
          expect(arg1).toBe(foo);
          expect(arg2).toBe(bar);
        });

        ee.on('event_3', function (evt, arg1, arg2, arg3) {
          expect(arguments.length).toBe(4);
          expect(arg1).toBe(foo);
          expect(arg2).toBe(bar);
          expect(arg3).toBe(xyz);
        });

        ee.on('event_4', function (evt, arg1, arg2, arg3, arg4) {
          expect(arguments.length).toBe(5);
          expect(arg1).toBe(foo);
          expect(arg2).toBe(bar);
          expect(arg3).toBe(xyz);
          expect(arg4).toBe(undefined);
        });

        ee.emit('event_1', foo);
        ee.emit('event_2', foo, bar);
        ee.emit('event_3', foo, bar, xyz);
        ee.emit('event_4', foo, bar, xyz, zcx);
      });

      it('should return instance for chaining', function () {
        expect(ee.emit('event')).toBe(ee);
      });
    });

    describe('once', function () {
      it('should subscribe to given event and remove this subscription once handler is called', function () {
        ee.once('event_1', writeLogFn('event_1a'));
        ee.once('event_2', writeLogFn('event_2'));
        ee.once('event_1', writeLogFn('event_1b'));

        ee.emit('event_1');
        ee.emit('event_2');

        ee.emit('event_1');
        ee.emit('event_2');

        ee.emit('event_1');
        ee.emit('event_2');

        expect(log).toEqual([
          'event_1a',
          'event_1b',
          'event_2'
        ]);
      });

      it('should handle nested calls properly', function () {
        ee.once('event_1', function () {
          writeLog('event_1a');
          ee.once('event_1', writeLogFn('event_1b'));
        });

        ee.emit('event_1');

        expect(log).toEqual([
          'event_1a'
        ]);

        resetLog();

        ee.emit('event_1');

        expect(log).toEqual([
          'event_1b'
        ]);

        resetLog();

        ee.emit('event_1');

        expect(log).toEqual([]);
      });

      it('should support a context for handler', function () {
        var obj = {
          foo: 'bar',
          getFoo: function getFoo () {
            writeLog(this.foo);
          }
        };

        ee.once('event_1', obj.getFoo, obj);
        ee.emit('event_1');
        ee.emit('event_1');

        expect(log).toEqual([
          'bar'
        ]);
      });

      it('should support multiple events', function () {
        ee.once('event_1 event_2', writeLogFn('handler_1'));
        ee.once(' event_2   event_3 ', writeLogFn('handler_2'));

        ee.emit('event_1');
        ee.emit('event_2');
        ee.emit('event_3');

        expect(log).toEqual([
          'handler_1',
          'handler_1',
          'handler_2',
          'handler_2'
        ]);

        resetLog();

        ee.emit('event_1');
        ee.emit('event_2');
        ee.emit('event_3');

        expect(log).toEqual([]);
      });

      it('should return instance for chaining', function () {
        expect(ee.once('event', noop)).toBe(ee);
      });
    });
  });
});
