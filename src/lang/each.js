/**
 * @require type
 * Iterates through array or object
 * If first argument has a plain type callback will be invoked once
 */
var each = (function () {
  var supportsForEach = 'forEach' in Array.prototype;

  return function (obj, fn, ctx) {
    var argType = type(obj);
    if (argType === 'array') {
      if (supportsForEach) {
        obj.forEach(fn, ctx || window);
      } else {
        for (var i = 0, len = obj.length; i < len; i++) {
          fn.call(ctx, obj[i], i);
        }
      }
    } else if (type === 'object') {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          fn.call(ctx, obj[key], key);
        }
      }
    } else {
      fn.call(ctx, obj);
    }
  };
}());