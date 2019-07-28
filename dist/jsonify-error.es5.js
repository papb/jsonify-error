(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

window.jsonifyError = require('./index.js');

},{"./index.js":2}],2:[function(require,module,exports){
"use strict";

var jsonifyError = require("./lib/jsonify-error");
var overrideConsole = require("./lib/override-console");
var overrideErrorMethods = require("./lib/override-error-methods");
var log = require("./lib/log");
var toString = require("./lib/to-string");

module.exports = jsonifyError;
module.exports.overrideConsole = overrideConsole;
module.exports.overrideErrorMethods = overrideErrorMethods;
module.exports.log = log;
module.exports.asString = toString;

},{"./lib/jsonify-error":6,"./lib/log":3,"./lib/override-console":7,"./lib/override-error-methods":8,"./lib/to-string":10}],3:[function(require,module,exports){
"use strict";

var mapArg = require("./../map-arg");

module.exports = function log(error) {
    // In browsers, we do not colorize the error with chalk.
    console.error(mapArg(error));
};

},{"./../map-arg":4}],4:[function(require,module,exports){
"use strict";

var jsonifyError = require("./../jsonify-error");

module.exports = function mapArg(arg) {
    // In browsers, we convert the error to JSON but not to string, since the browser's
    // console is interactive and allows inspecting the plain object easily.
    return arg instanceof Error ? jsonifyError(arg) : arg;
};

},{"./../jsonify-error":6}],5:[function(require,module,exports){
"use strict";

module.exports = function getSuperclasses(obj) {
    var superclasses = [];
    var temp = Object.getPrototypeOf(obj);
    if (temp !== null) temp = Object.getPrototypeOf(temp);
    while (temp !== null) {
        superclasses.push(temp.constructor.name);
        temp = Object.getPrototypeOf(temp);
    }
    return superclasses;
};

},{}],6:[function(require,module,exports){
"use strict";

var getSuperclasses = require("./get-superclasses");

var stripColorsIfString = require("./strip-colors-if-string");

module.exports = function jsonifyError(error) {
    if (!(error instanceof Error)) return error;
    var wrappedError = {};
    wrappedError.name = error.name || "<no name available>";
    wrappedError.className = error.constructor.name || "<no class name available>";
    wrappedError.message = stripColorsIfString(error.message) || "<no message available>";
    wrappedError.superclasses = getSuperclasses(error);
    wrappedError.enumerableFields = {};
    for (var x in error) {
        if (typeof error[x] === "function") continue;
        wrappedError.enumerableFields[x] = stripColorsIfString(error[x]);
    }
    if (typeof error.stack === "string" && error.stack.length > 0) {
        wrappedError.stack = error.stack.split('\n').map(function (x) {
            return x.replace(/^\s+/, "");
        }).filter(function (x) {
            return x;
        }).map(stripColorsIfString);
    } else {
        wrappedError.stack = stripColorsIfString(error.stack) || "<no stack trace available>";
    }
    return wrappedError;
};

},{"./get-superclasses":5,"./strip-colors-if-string":9}],7:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var mapArg = require("./map-arg");

var methodNames = ["log", "debug", "info", "warn", "error"];

var alreadyOverridden = false;

module.exports = function overrideConsole() {
    if (alreadyOverridden) return;
    alreadyOverridden = true;

    var originalMethods = {};

    var _loop = function _loop(methodName) {
        if (!console[methodName]) return "continue";
        originalMethods[methodName] = console[methodName].bind(console);
        console[methodName] = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            originalMethods[methodName].apply(originalMethods, _toConsumableArray(args.map(mapArg)));
        };
    };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = methodNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var methodName = _step.value;

            var _ret = _loop(methodName);

            if (_ret === "continue") continue;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
};

},{"./map-arg":4}],8:[function(require,module,exports){
"use strict";

var jsonifyError = require("./jsonify-error");
var toString = require("./to-string");

module.exports = function () {

    /**
     * Converts this Error instance to a JSON representation.
     * 
     * @return {object}
     */
    Error.prototype.toJSON = function () {
        return jsonifyError(this);
    };

    /**
     * Converts this Error instance to the full stringification
     * of its JSON representation.
     * 
     * @param {number} [amountOfSpaces=4] The amount of spaces to use
     * for indentation in the output string.
     * 
     * @return {string}
     */
    Error.prototype.toString = function () {
        var amountOfSpaces = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;

        return toString(this, amountOfSpaces);
    };
};

},{"./jsonify-error":6,"./to-string":10}],9:[function(require,module,exports){
"use strict";

function stripColorsIfString(arg) {
    if (typeof arg !== "string") return arg;
    /* eslint-disable-next-line no-control-regex */
    return arg.replace(/\u001b\[\d{1,2}m/g, "").replace(/\\u001b\[\d{1,2}m/g, "");
}

module.exports = stripColorsIfString;

},{}],10:[function(require,module,exports){
"use strict";

var stringify = require("json-stringify-safe");
var jsonifyError = require("./jsonify-error");

/**
 * Converts the given error to a big string representation, containing
 * the whole data from its JSON representation.
 * 
 * @param {error} error The error to be converted.
 * @param {number} [amountOfSpaces=4] The amount of spaces to use
 * for indentation in the output string.
 * 
 * @return {string}
 * @throws {TypeError} If the given error is not an instance of Error
 */
module.exports = function toString(error) {
  var amountOfSpaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!(error instanceof Error)) throw new TypeError("jsonifyError.toString() error: First argument must be instance of Error.");
  var asJSON = jsonifyError(error);
  return asJSON.className + ": " + asJSON.message + " " + stringify(asJSON, null, amountOfSpaces);
};

},{"./jsonify-error":6,"json-stringify-safe":11}],11:[function(require,module,exports){
exports = module.exports = stringify
exports.getSerialize = serializer

function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJpbmRleC5qcyIsImxpYi9icm93c2VyLXNwZWNpZmljL2xvZy5qcyIsImxpYi9icm93c2VyLXNwZWNpZmljL21hcC1hcmcuanMiLCJsaWIvZ2V0LXN1cGVyY2xhc3Nlcy5qcyIsImxpYi9qc29uaWZ5LWVycm9yLmpzIiwibGliL292ZXJyaWRlLWNvbnNvbGUuanMiLCJsaWIvb3ZlcnJpZGUtZXJyb3ItbWV0aG9kcy5qcyIsImxpYi9zdHJpcC1jb2xvcnMtaWYtc3RyaW5nLmpzIiwibGliL3RvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9qc29uLXN0cmluZ2lmeS1zYWZlL3N0cmluZ2lmeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUNBLE9BQU8sWUFBUCxHQUFzQixRQUFRLFlBQVIsQ0FBdEI7OztBQ0RBOztBQUVBLElBQU0sZUFBZSxRQUFRLHFCQUFSLENBQXJCO0FBQ0EsSUFBTSxrQkFBa0IsUUFBUSx3QkFBUixDQUF4QjtBQUNBLElBQU0sdUJBQXVCLFFBQVEsOEJBQVIsQ0FBN0I7QUFDQSxJQUFNLE1BQU0sUUFBUSxXQUFSLENBQVo7QUFDQSxJQUFNLFdBQVcsUUFBUSxpQkFBUixDQUFqQjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsWUFBakI7QUFDQSxPQUFPLE9BQVAsQ0FBZSxlQUFmLEdBQWlDLGVBQWpDO0FBQ0EsT0FBTyxPQUFQLENBQWUsb0JBQWYsR0FBc0Msb0JBQXRDO0FBQ0EsT0FBTyxPQUFQLENBQWUsR0FBZixHQUFxQixHQUFyQjtBQUNBLE9BQU8sT0FBUCxDQUFlLFFBQWYsR0FBMEIsUUFBMUI7OztBQ1pBOztBQUVBLElBQU0sU0FBUyxRQUFRLGNBQVIsQ0FBZjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxHQUFULENBQWEsS0FBYixFQUFvQjtBQUNqQztBQUNBLFlBQVEsS0FBUixDQUFj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Q1JBOztBQUVBLElBQU0sWUFBWSxRQUFRLHFCQUFSLENBQWxCO0FBQ0EsSUFBTSxlQUFlLFFBQVEsaUJBQVIsQ0FBckI7O0FBRUE7Ozs7Ozs7Ozs7O0FBV0EsT0FBTyxPQUFQLEdBQWlCLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUE2QztBQUFBLE1BQXBCLGNBQW9CLHVFQUFILENBQUc7O0FBQzFELE1BQUksRUFBRSxpQkFBaUIsS0FBbkIsQ0FBSixFQUErQixNQUFNLElBQUksU0FBSixDQUFjLDBFQUFkLENBQU47QUFDL0IsTUFBTSxTQUFTLGFBQWEsS0FBYixDQUFmO0FBQ0EsU0FBVSxPQUFPLFNBQWpCLFVBQStCLE9BQU8sT0FBdEMsU0FBaUQsVUFBVSxNQUFWLEVBQWtCLElBQWxCLEVBQXdCLGNBQXhCLENBQWpEO0FBQ0gsQ0FKRDs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG53aW5kb3cuanNvbmlmeUVycm9yID0gcmVxdWlyZSgnLi9pbmRleC5qcycpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9saWIvanNvbmlmeS1lcnJvclwiKTtcbmNvbnN0IG92ZXJyaWRlQ29uc29sZSA9IHJlcXVpcmUoXCIuL2xpYi9vdmVycmlkZS1jb25zb2xlXCIpO1xuY29uc3Qgb3ZlcnJpZGVFcnJvck1ldGhvZHMgPSByZXF1aXJlKFwiLi9saWIvb3ZlcnJpZGUtZXJyb3ItbWV0aG9kc1wiKTtcbmNvbnN0IGxvZyA9IHJlcXVpcmUoXCIuL2xpYi9sb2dcIik7XG5jb25zdCB0b1N0cmluZyA9IHJlcXVpcmUoXCIuL2xpYi90by1zdHJpbmdcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ganNvbmlmeUVycm9yO1xubW9kdWxlLmV4cG9ydHMub3ZlcnJpZGVDb25zb2xlID0gb3ZlcnJpZGVDb25zb2xlO1xubW9kdWxlLmV4cG9ydHMub3ZlcnJpZGVFcnJvck1ldGhvZHMgPSBvdmVycmlkZUVycm9yTWV0aG9kcztcbm1vZHVsZS5leHBvcnRzLmxvZyA9IGxvZztcbm1vZHVsZS5leHBvcnRzLmFzU3RyaW5nID0gdG9TdHJpbmc7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IG1hcEFyZyA9IHJlcXVpcmUoXCIuLy4uL21hcC1hcmdcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbG9nKGVycm9yKSB7XG4gICAgLy8gSW4gYnJvd3NlcnMsIHdlIGRvIG5vdCBjb2xvcml6ZSB0aGUgZXJyb3Igd2l0aCBjaGFsay5cbiAgICBjb25zb2xlLmVycm9yKG1hcEFyZyhlcnJvcikpO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vLi4vanNvbmlmeS1lcnJvclwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXBBcmcoYXJnKSB7XG4gICAgLy8gSW4gYnJvd3NlcnMsIHdlIGNvbnZlcnQgdGhlIGVycm9yIHRvIEpTT04gYnV0IG5vdCB0byBzdHJpbmcsIHNpbmNlIHRoZSBicm93c2VyJ3NcbiAgICAvLyBjb25zb2xlIGlzIGludGVyYWN0aXZlIGFuZCBhbGxvd3MgaW5zcGVjdGluZyB0aGUgcGxhaW4gb2JqZWN0IGVhc2lseS5cbiAgICByZXR1cm4gYXJnIGluc3RhbmNlb2YgRXJyb3IgPyBqc29uaWZ5RXJyb3IoYXJnKSA6IGFyZztcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U3VwZXJjbGFzc2VzKG9iaikge1xuICAgIGNvbnN0IHN1cGVyY2xhc3NlcyA9IFtdO1xuICAgIGxldCB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gICAgaWYgKHRlbXAgIT09IG51bGwpIHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGVtcCk7XG4gICAgd2hpbGUgKHRlbXAgIT09IG51bGwpIHtcbiAgICAgICAgc3VwZXJjbGFzc2VzLnB1c2godGVtcC5jb25zdHJ1Y3Rvci5uYW1lKTtcbiAgICAgICAgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0ZW1wKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyY2xhc3Nlcztcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IGdldFN1cGVyY2xhc3NlcyA9IHJlcXVpcmUoXCIuL2dldC1zdXBlcmNsYXNzZXNcIik7XG5cbmNvbnN0IHN0cmlwQ29sb3JzSWZTdHJpbmcgPSByZXF1aXJlKFwiLi9zdHJpcC1jb2xvcnMtaWYtc3RyaW5nXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGpzb25pZnlFcnJvcihlcnJvcikge1xuICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSByZXR1cm4gZXJyb3I7XG4gICAgY29uc3Qgd3JhcHBlZEVycm9yID0ge307XG4gICAgd3JhcHBlZEVycm9yLm5hbWUgPSBlcnJvci5uYW1lIHx8IFwiPG5vIG5hbWUgYXZhaWxhYmxlPlwiO1xuICAgIHdyYXBwZWRFcnJvci5jbGFzc05hbWUgPSBlcnJvci5jb25zdHJ1Y3Rvci5uYW1lIHx8IFwiPG5vIGNsYXNzIG5hbWUgYXZhaWxhYmxlPlwiO1xuICAgIHdyYXBwZWRFcnJvci5tZXNzYWdlID0gc3RyaXBDb2xvcnNJZlN0cmluZyhlcnJvci5tZXNzYWdlKSB8fCBcIjxubyBtZXNzYWdlIGF2YWlsYWJsZT5cIjtcbiAgICB3cmFwcGVkRXJyb3Iuc3VwZXJjbGFzc2VzID0gZ2V0U3VwZXJjbGFzc2VzKGVycm9yKTtcbiAgICB3cmFwcGVkRXJyb3IuZW51bWVyYWJsZUZpZWxkcyA9IHt9O1xuICAgIGZvciAoY29uc3QgeCBpbiBlcnJvcikge1xuICAgICAgICBpZiAodHlwZW9mIGVycm9yW3hdID09PSBcImZ1bmN0aW9uXCIpIGNvbnRpbnVlO1xuICAgICAgICB3cmFwcGVkRXJyb3IuZW51bWVyYWJsZUZpZWxkc1t4XSA9IHN0cmlwQ29sb3JzSWZTdHJpbmcoZXJyb3JbeF0pO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrID09PSBcInN0cmluZ1wiICYmIGVycm9yLnN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLm1hcCh4ID0+IHgucmVwbGFjZSgvXlxccysvLCBcIlwiKSkuZmlsdGVyKHggPT4geCkubWFwKHN0cmlwQ29sb3JzSWZTdHJpbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdyYXBwZWRFcnJvci5zdGFjayA9IHN0cmlwQ29sb3JzSWZTdHJpbmcoZXJyb3Iuc3RhY2spIHx8IFwiPG5vIHN0YWNrIHRyYWNlIGF2YWlsYWJsZT5cIjtcbiAgICB9XG4gICAgcmV0dXJuIHdyYXBwZWRFcnJvcjtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IG1hcEFyZyA9IHJlcXVpcmUoXCIuL21hcC1hcmdcIik7XG5cbmNvbnN0IG1ldGhvZE5hbWVzID0gW1wibG9nXCIsIFwiZGVidWdcIiwgXCJpbmZvXCIsIFwid2FyblwiLCBcImVycm9yXCJdO1xuXG5sZXQgYWxyZWFkeU92ZXJyaWRkZW4gPSBmYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvdmVycmlkZUNvbnNvbGUoKSB7XG4gICAgaWYgKGFscmVhZHlPdmVycmlkZGVuKSByZXR1cm47XG4gICAgYWxyZWFkeU92ZXJyaWRkZW4gPSB0cnVlO1xuXG4gICAgY29uc3Qgb3JpZ2luYWxNZXRob2RzID0ge307XG5cbiAgICBmb3IgKGNvbnN0IG1ldGhvZE5hbWUgb2YgbWV0aG9kTmFtZXMpIHtcbiAgICAgICAgaWYgKCFjb25zb2xlW21ldGhvZE5hbWVdKSBjb250aW51ZTtcbiAgICAgICAgb3JpZ2luYWxNZXRob2RzW21ldGhvZE5hbWVdID0gY29uc29sZVttZXRob2ROYW1lXS5iaW5kKGNvbnNvbGUpO1xuICAgICAgICBjb25zb2xlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgICAgICAgb3JpZ2luYWxNZXRob2RzW21ldGhvZE5hbWVdKC4uLmFyZ3MubWFwKG1hcEFyZykpO1xuICAgICAgICB9O1xuICAgIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2pzb25pZnktZXJyb3JcIik7XG5jb25zdCB0b1N0cmluZyA9IHJlcXVpcmUoXCIuL3RvLXN0cmluZ1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHRoaXMgRXJyb3IgaW5zdGFuY2UgdG8gYSBKU09OIHJlcHJlc2VudGF0aW9uLlxuICAgICAqIFxuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKi9cbiAgICBFcnJvci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBqc29uaWZ5RXJyb3IodGhpcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHRoaXMgRXJyb3IgaW5zdGFuY2UgdG8gdGhlIGZ1bGwgc3RyaW5naWZpY2F0aW9uXG4gICAgICogb2YgaXRzIEpTT04gcmVwcmVzZW50YXRpb24uXG4gICAgICogXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRPZlNwYWNlcz00XSBUaGUgYW1vdW50IG9mIHNwYWNlcyB0byB1c2VcbiAgICAgKiBmb3IgaW5kZW50YXRpb24gaW4gdGhlIG91dHB1dCBzdHJpbmcuXG4gICAgICogXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIEVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKGFtb3VudE9mU3BhY2VzID0gNCkge1xuICAgICAgICByZXR1cm4gdG9TdHJpbmcodGhpcywgYW1vdW50T2ZTcGFjZXMpO1xuICAgIH07XG5cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBzdHJpcENvbG9yc0lmU3RyaW5nKGFyZykge1xyXG4gICAgaWYgKHR5cGVvZiBhcmcgIT09XCJzdHJpbmdcIikgcmV0dXJuIGFyZztcclxuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb250cm9sLXJlZ2V4ICovXHJcbiAgICByZXR1cm4gYXJnLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGR7MSwyfW0vZywgXCJcIikucmVwbGFjZSgvXFxcXHUwMDFiXFxbXFxkezEsMn1tL2csIFwiXCIpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmlwQ29sb3JzSWZTdHJpbmc7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IHN0cmluZ2lmeSA9IHJlcXVpcmUoXCJqc29uLXN0cmluZ2lmeS1zYWZlXCIpO1xuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vanNvbmlmeS1lcnJvclwiKTtcblxuLyoqXG4gKiBDb252ZXJ0cyB0aGUgZ2l2ZW4gZXJyb3IgdG8gYSBiaWcgc3RyaW5nIHJlcHJlc2VudGF0aW9uLCBjb250YWluaW5nXG4gKiB0aGUgd2hvbGUgZGF0YSBmcm9tIGl0cyBKU09OIHJlcHJlc2VudGF0aW9uLlxuICogXG4gKiBAcGFyYW0ge2Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gYmUgY29udmVydGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRPZlNwYWNlcz00XSBUaGUgYW1vdW50IG9mIHNwYWNlcyB0byB1c2VcbiAqIGZvciBpbmRlbnRhdGlvbiBpbiB0aGUgb3V0cHV0IHN0cmluZy5cbiAqIFxuICogQHJldHVybiB7c3RyaW5nfVxuICogQHRocm93cyB7VHlwZUVycm9yfSBJZiB0aGUgZ2l2ZW4gZXJyb3IgaXMgbm90IGFuIGluc3RhbmNlIG9mIEVycm9yXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdG9TdHJpbmcoZXJyb3IsIGFtb3VudE9mU3BhY2VzID0gNCkge1xuICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwianNvbmlmeUVycm9yLnRvU3RyaW5nKCkgZXJyb3I6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgaW5zdGFuY2Ugb2YgRXJyb3IuXCIpO1xuICAgIGNvbnN0IGFzSlNPTiA9IGpzb25pZnlFcnJvcihlcnJvcik7XG4gICAgcmV0dXJuIGAke2FzSlNPTi5jbGFzc05hbWV9OiAke2FzSlNPTi5tZXNzYWdlfSAke3N0cmluZ2lmeShhc0pTT04sIG51bGwsIGFtb3VudE9mU3BhY2VzKX1gO1xufTtcbiIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHN0cmluZ2lmeVxuZXhwb3J0cy5nZXRTZXJpYWxpemUgPSBzZXJpYWxpemVyXG5cbmZ1bmN0aW9uIHN0cmluZ2lmeShvYmosIHJlcGxhY2VyLCBzcGFjZXMsIGN5Y2xlUmVwbGFjZXIpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaiwgc2VyaWFsaXplcihyZXBsYWNlciwgY3ljbGVSZXBsYWNlciksIHNwYWNlcylcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplcihyZXBsYWNlciwgY3ljbGVSZXBsYWNlcikge1xuICB2YXIgc3RhY2sgPSBbXSwga2V5cyA9IFtdXG5cbiAgaWYgKGN5Y2xlUmVwbGFjZXIgPT0gbnVsbCkgY3ljbGVSZXBsYWNlciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICBpZiAoc3RhY2tbMF0gPT09IHZhbHVlKSByZXR1cm4gXCJbQ2lyY3VsYXIgfl1cIlxuICAgIHJldHVybiBcIltDaXJjdWxhciB+LlwiICsga2V5cy5zbGljZSgwLCBzdGFjay5pbmRleE9mKHZhbHVlKSkuam9pbihcIi5cIikgKyBcIl1cIlxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICBpZiAoc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHRoaXNQb3MgPSBzdGFjay5pbmRleE9mKHRoaXMpXG4gICAgICB+dGhpc1BvcyA/IHN0YWNrLnNwbGljZSh0aGlzUG9zICsgMSkgOiBzdGFjay5wdXNoKHRoaXMpXG4gICAgICB+dGhpc1BvcyA/IGtleXMuc3BsaWNlKHRoaXNQb3MsIEluZmluaXR5LCBrZXkpIDoga2V5cy5wdXNoKGtleSlcbiAgICAgIGlmICh+c3RhY2suaW5kZXhPZih2YWx1ZSkpIHZhbHVlID0gY3ljbGVSZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpXG4gICAgfVxuICAgIGVsc2Ugc3RhY2sucHVzaCh2YWx1ZSlcblxuICAgIHJldHVybiByZXBsYWNlciA9PSBudWxsID8gdmFsdWUgOiByZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpXG4gIH1cbn1cbiJdfQ==
