# Hub.js

Dependency free lightweight implementation of pattern
[publish-subscribe](http://en.wikipedia.org/wiki/Publish/subscribe) in Javascript

## Why hub.js

* Dependency free
* Cross-browser: Chrome, Safari 3+, FF 1.5+, IE 5.5+, Opera 7+, all mobile browsers
* Support context for subscribers
* Support subscribing to multiple events at once
* Support AMD / CommonJS
* Very simple - no bullshit like namespaces, async event triggering, priority, try/catch etc
* Small size (380 bytes minified and gzipped)

## Examples

### Basic example

```javascript
// subscribe to the event
Hub.on('some_event', function (evt) {
  console.log('event ' + evt + ' has been fired');
});

// publish the event
Hub.trigger('some_event');
```

### Listener context

```javascript
// create some object
var obj = {
  foo: 'bar',
  getFoo: function () {
    return this.foo;
  }
}

// subscribe to the event and pass a context for the listener
Hub.on('some_event', obj.getFoo, obj);
```

### Pass data to the listener

```javascript
// subscribe to the event
Hub.on('some_event', function (evt, arg1, arg2) {
  console.log('event ' + evt + ' has been fired with arguments:', arg1, arg2);
});

// publish the event
Hub.trigger('some_event', 'arg1', {
  foo: bar
});
```

### Add a one time subscription

```javascript
// subscribe to the event
Hub.once('event', function () {
  console.log('event fired');
});

Hub.trigger('event'); // the event fired
Hub.trigger('event'); // nothing happened
```

### Remove a subscription

```javascript
// create a listener
var listener = function (evt, arg1, arg2) {
 //
}

// subscribe to the event
Hub.on('some_event', listener);
Hub.on('another_event', function () { /*...*/ });
Hub.on('another_event', function () { /*...*/ });

// publish the event
Hub.trigger('some_event');

// remove specific listener
Hub.off('some_event', listener);

// remove all listeners of a specified event
Hub.off('another_event');
```

### Deal with a list of events

```javascript
// create a listener
var listener = function (evt) {
  console.log('event ' + evt + ' has been fired');
}

// add this listener for three events at once
Hub.on('event_1 event_2 event_3', listener);

// publish two events
Hub.trigger('events_1 events_3', 'some data');

// remove specific listener of event_1 and event_2
Hub.off('event_1 event_2', listener);

// remove all subscriptions of event_2 and event_3
Hub.off('event_2 event_3');
```
