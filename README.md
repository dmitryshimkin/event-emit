# Hub.js

Dependency free lightweight implementation of pattern
[publish-subscribe](http://en.wikipedia.org/wiki/Publish/subscribe) in Javascript

## Why hub.js

* Dependency free
* Cross-browser: Chrome, Safari 3+, FF 1.5+, IE 5.5+, Opera 7+, all mobile browsers
* Support context for subscribers
* Support subscribing to multiple messages at once
* Support AMD / CommonJS
* Very simple - no bullshit like namespaces, async message delivering, priority, try/catch etc
* Small size (380 bytes minified and gzipped)

## Examples

### Basic example

```javascript
// subscribe on message
Hub.on('some_message', function (msg) {
  console.log('message ' + msg + ' has been received');
});

// publish a message
Hub.trigger('some_message');
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

// subscribe on message and pass context for listener
Hub.on('some_message', obj.getFoo, obj);
```

### Pass data to subscriber

```javascript
// subscribe on message
Hub.on('some_message', function (msg, arg1, arg2) {
  console.log('message ' + msg + ' has been received with arguments:', arg1, arg2);
});

// publish a message
Hub.trigger('some_message', 'arg1', {
  foo: bar
});
```

### Once

```javascript
// subscribe on message
Hub.once('event', function () {
  console.log('event fired');
});

Hub.trigger('event'); // event fired
Hub.trigger('event'); // nothing happened
```

### Remove subscription

```javascript
// create message listener
var listener = function (msg, arg1, arg2) {
 //
}

// subscribe to message
Hub.on('some_message', listener);
Hub.on('another_message', function () { /*...*/ });
Hub.on('another_message', function () { /*...*/ });

// publish a message
Hub.trigger('some_message');

// remove specific listener
Hub.off('some_message', listener);

// remove all listeners of a message
Hub.off('another_message');
```

### Deal with list of messages

```javascript
// create listener
var listener = function (msg) {
  console.log('message ' + msg + ' has been received');
}

// add this listener for three messages at once
Hub.on('message_1 message_2 message_3', listener);

// publish two messages
Hub.trigger('message_1 message_3', 'some data');

// remove specific subscription for message_1 and message_2
Hub.off('message_1 message_2', listener);

// remove all subscriptions for message_2 and message_3
Hub.off('message_2 message_3');
```
