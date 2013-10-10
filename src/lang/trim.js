/**
 * Trim string
 * @param str {String} String to be trimmed
 * @return {String} Trimmed string
 * @private
 */

var trim = function (str) {
  return str.replace(trim.r, '');
};

trim.r = /^\s+|\s+$/g;