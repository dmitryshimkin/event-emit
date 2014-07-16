'use strict';

/**
 * Trim string
 * @param str {String} String to be trimmed
 * @return {String} Trimmed string
 * @public
 */

Lang.trim = function (str) {
  return str.replace(Lang.trim.r, '');
};

Lang.trim.r = /^\s+|\s+$/g;
