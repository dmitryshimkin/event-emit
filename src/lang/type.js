/**
 * @param {Object|Array}
 */

var type = (function () {
  var objectPrototype = Object.prototype;
  var objectToString = objectPrototype.toString;
  var class2type = {};
  var classes = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'];

  for (var i = 0, len = classes.length; i < len; i++) {
    var className = classes[i];
    class2type['[object ' + className + ']'] = className.toLowerCase();
  }

  return function (arg) {
    if (arg === null) {
      return 'null';
    }
    return typeof arg === 'object' || typeof arg === 'function' ? class2type[objectToString.call(arg)] || 'object' : typeof arg;
  };
}());

/**
 * @param arg {*} Argument to be tested
 * @return {Boolean} True if argument is a function
 */

var isFunction = function (arg) {
  return type(arg) === 'function';
};

/**
 * @param arg {*} Argument to be tested
 * @return {Boolean} True if argument is an array
 */

var isArray = function (arg) {
  return type(arg) === 'array';
};

/**
 * @param obj {*} Argument to be tested
 * @return {Boolean} True if argument is not an object
 */

var isPlainObject = function (obj) {
  var hasOwn = Object.prototype.hasOwnProperty;

  if (!obj || type(obj) !== "object" || obj.nodeType) {
    return false
  }
  try {
    if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototype")) {
      return false
    }
  } catch (e) {
    return false
  }
  var key;
  for (key in obj) {}
  return key === undefined || hasOwn.call(obj, key);
};