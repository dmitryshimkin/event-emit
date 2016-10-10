# event-emit

Dependency free lightweight implementation of
[Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) in Javascript

## Features

* Dependency free
* Cross-browser: Chrome, Safari 3+, FF 1.5+, IE 5.5+, Opera 7+, all mobile browsers
* Supports a context for subscribers
* Supports subscribing to multiple events at once
* Simple: no bullshit like namespaces, async event emitting, priority, try/catch etc
* Small size: (750 bytes minified and gzipped)
* Provided as a UMD module

## Install

Install it from NPM:

```
npm install event-emit
```

Or download it directly
from [/dist/event-emit.min.js](https://github.com/dmitryshimkin/emitter/blob/master/dist/event-emit.min.js)

## Usage

Include it as a script tag to your HTML page:

```html
<script src="node_modules/event-emit/dist/event-emit.min.js"></script>
<script>
  // window.EventEmit is avaialable here
</script>
```

Or use it as a CommonJS module:

```javascript
var EventEmit = require('event-emit')
```

or as a AMD module:

```javascript
define(['EventEmit'], function (EventEmit) {
  // Use EventEmit here
});
```

or as a ES2015 module:

```javascript
import EventEmit from 'event-emit'
```


## Examples

### Basic example

```javascript
import EventEmit from 'event-emit'

const componentA = {}

EventEmit.mixinTo(componentA)

// Subscribe to event
componentA.on('some_event', function (evt) {
  console.log(`event ${evt} has been fired`);
});

// Publish the event
componentA.emit('some_event');
```

### Listener context

```javascript
import EventEmit from 'event-emit'

const componentA = {}
const componentB = {
  onChange: function () {
    console.log(this === componentB) // true
  }
}

EventEmit.mixinTo(componentA)

// Subscribe to the event and pass a context for the listener
componentA.on('some_event', componentB.onChange, componentB);
```

### Pass data to the listener

```javascript
import EventEmit from 'event-emit'

const componentA = {}

EventEmit.mixinTo(componentA)

componentA.on('some_event', function (evt, arg1, arg2) {
  console.log(`event ${evt} has been fired with`, arg1, arg2); // {foo: bar}, 10
});

// Publish the event
componentA.emit('some_event', {foo: bar}, 10);
```

### Add a one time subscription

```javascript
import EventEmit from 'event-emit'

const componentA = {}

EventEmit.mixinTo(componentA)

// Subscribe to the event
componentA.once('event', function () {
  console.log('event fired');
});

componentA.emit('event'); // "event fired"
componentA.emit('event'); // Nothing happened
```

### Remove a subscription

```javascript
import EventEmit from 'event-emit'

const componentA = {}
const componentB = {}

EventEmit.mixinTo(componentA)

// Define a listener
function listener (evt, data) {
}

// Subscribe to events
componentA.on('some_event', listener)
componentA.on('some_event', listener, componentB)
componentA.on('another_event', function () { /*...*/ })
componentA.on('another_event', function () { /*...*/ })

// Publish the event
componentA.emit('some_event')

// Remove the first subscription that was created w/o context
componentA.off('some_event', listener)

// Remove the second subscription w/ context
componentA.off('some_event', listener, componentB)

// Remove all listeners of given event
componentA.off('another_event')
```

### Deal with a list of events

```javascript
import EventEmit from 'event-emit'

const componentA = {}

EventEmit.mixinTo(componentA)

// Defined a listener
function listener (evt) {
  console.log(`event ${evt} has been fired`)
}

// Add this listener for three events at once
componentA.on('event_1 event_2 event_3', listener)

// Publish two events
componentA.emit('events_1 events_3', 'some data')

// remove specific listener of event_1 and event_2
componentA.off('event_1 event_2', listener)

// remove all subscriptions of event_2 and event_3
componentA.off('event_2 event_3')
```

### PubSub pattern implementation

```javascript
import EventEmit from 'event-emit'

const {
  emit: publish,
  on: subscribe,
  off: unsubscribe
} = EventEmit.prototype;

export default {
  publish,
  subscribe,
  unsubscribe
}
```

```javascript
// component-a/index.js
import pubsub from 'path/to/pubsub'

pubsub.subscribe('some-event', function (evt, data) {
  console.log(`Pubsub event ${evt} has been fired with`, data);
})
```

```javascript
// component-b/index.js
import pubsub from 'path/to/pubsub'

pubsub.publish('some-event', {
  foo: 'bar'
})
```

# License

MIT
