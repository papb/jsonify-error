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

},{"./lib/jsonify-error":5,"./lib/log":3,"./lib/override-console":6,"./lib/override-error-methods":7,"./lib/to-string":8}],3:[function(require,module,exports){
"use strict";

var toString = require("./../to-string");

module.exports = function log(error) {
    var amountOfSpaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

    console.error(toString(error, amountOfSpaces));
};

},{"./../to-string":8}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";

var getSuperclasses = require("./get-superclasses");

module.exports = function jsonifyError(error) {
    if (!(error instanceof Error)) return error;
    var wrappedError = {};
    wrappedError.name = error.name || "<no name available>";
    wrappedError.className = error.constructor.name || "<no class name available>";
    wrappedError.message = error.message || "<no message available>";
    wrappedError.superclasses = getSuperclasses(error);
    wrappedError.enumerableFields = {};
    for (var x in error) {
        if (typeof error[x] === "function") continue;
        wrappedError.enumerableFields[x] = error[x];
    }
    if (typeof error.stack === "string" && error.stack.length > 0) {
        wrappedError.stack = error.stack.split('\n').map(function (x) {
            return x.replace(/^\s+/, "");
        });
    } else {
        wrappedError.stack = error.stack || "<no stack trace available>";
    }
    return wrappedError;
};

},{"./get-superclasses":4}],6:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var toString = require("./to-string");

function mapArgs(args) {
    return args.map(function (arg) {
        return arg instanceof Error ? toString(arg) : arg;
    });
}

var methodNames = ["log", "debug", "info", "warn", "error"];

var alreadyOverridden = false;

module.exports = function () {
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

            originalMethods[methodName].apply(originalMethods, _toConsumableArray(mapArgs(args)));
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

},{"./to-string":8}],7:[function(require,module,exports){
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

},{"./jsonify-error":5,"./to-string":8}],8:[function(require,module,exports){
"use strict";

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
  return asJSON.className + ": " + asJSON.message + " " + JSON.stringify(asJSON, null, amountOfSpaces);
};

},{"./jsonify-error":5}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJpbmRleC5qcyIsImxpYi9icm93c2VyLXNwZWNpZmljL2xvZy5qcyIsImxpYi9nZXQtc3VwZXJjbGFzc2VzLmpzIiwibGliL2pzb25pZnktZXJyb3IuanMiLCJsaWIvb3ZlcnJpZGUtY29uc29sZS5qcyIsImxpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzLmpzIiwibGliL3RvLXN0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUNBLE9BQU8sWUFBUCxHQUFzQixRQUFRLFlBQVIsQ0FBdEI7OztBQ0RBOztBQUVBLElBQU0sZUFBZSxRQUFRLHFCQUFSLENBQXJCO0FBQ0EsSUFBTSxrQkFBa0IsUUFBUSx3QkFBUixDQUF4QjtBQUNBLElBQU0sdUJBQXVCLFFBQVEsOEJBQVIsQ0FBN0I7QUFDQSxJQUFNLE1BQU0sUUFBUSxXQUFSLENBQVo7QUFDQSxJQUFNLFdBQVcsUUFBUSxpQkFBUixDQUFqQjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsWUFBakI7QUFDQSxPQUFPLE9BQVAsQ0FBZSxlQUFmLEdBQWlDLGVBQWpDO0FBQ0EsT0FBTyxPQUFQLENBQWUsb0JBQWYsR0FBc0Msb0JBQXRDO0FBQ0EsT0FBTyxPQUFQLENBQWUsR0FBZixHQUFxQixHQUFyQjtBQUNBLE9BQU8sT0FBUCxDQUFlLFFBQWYsR0FBMEIsUUFBMUI7OztBQ1pBOztBQUVBLElBQU0sV0FBVyxRQUFRLGdCQUFSLENBQWpCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixTQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQXdDO0FBQUEsUUFBcEIsY0FBb0IsdUVBQUgsQ0FBRzs7QUFDckQsWUFBUSxLQUFSLENBQWMsU0FBUyxLQUFULEVBQWdCLGNBQWhCLENBQWQ7QUFDSCxDQUZEOzs7QUNKQTs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxlQUFULENBQXlCLEdBQXpC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QSxxQ0FDUjtBQUs3QjtBQVp1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBYTNCLENBYkQ7OztBQ1pBOztBQUVBLElBQU0sZUFBZSxRQUFRLGlCQUFSLENBQXJCO0FBQ0EsSUFBTSxXQUFXLFFBQVEsYUFBUixDQUFqQjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsWUFBVzs7QUFFeEI7Ozs7O0FBS0EsVUFBTSxTQUFOLENBQWdCLE1BQWhCLEdBQXlCLFlBQVc7QUFDaEMsZUFBTyxhQUFhLElBQWIsQ0FBUDtBQUNILEtBRkQ7O0FBSUE7Ozs7Ozs7OztBQVNBLFVBQU0sU0FBTixDQUFnQixRQUFoQixHQUEyQixZQUE2QjtBQUFBLFlBQXBCLGNBQW9CLHVFQUFILENBQUc7O0FBQ3BELGVBQU8sU0FBUyxJQUFULEVBQWUsY0FBZixDQUFQO0FBQ0gsS0FGRDtBQUlILENBeEJEOzs7QUNMQTs7QUFFQSxJQUFNLGVBQWUsUUFBUSxpQkFBUixDQUFyQjs7QUFFQTs7Ozs7Ozs7Ozs7QUFXQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxRQUFULENBQWtCLEtBQWxCLEVBQTZDO0FBQUEsTUFBcEIsY0FBb0IsdUVBQUgsQ0FBRzs7QUFDMUQsTUFBSSxFQUFFLGlCQUFpQixLQUFuQixDQUFKLEVBQStCLE1BQU0sSUFBSSxTQUFKLENBQWMsMEVBQWQsQ0FBTjtBQUMvQixNQUFNLFNBQVMsYUFBYSxLQUFiLENBQWY7QUFDQSxTQUFVLE9BQU8sU0FBakIsVUFBK0IsT0FBTyxPQUF0QyxTQUFpRCxLQUFLLFNBQUwsQ0FBZSxNQUFmLEVBQXVCLElBQXZCLEVBQTZCLGNBQTdCLENBQWpEO0FBQ0gsQ0FKRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xyXG53aW5kb3cuanNvbmlmeUVycm9yID0gcmVxdWlyZSgnLi9pbmRleC5qcycpOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vbGliL2pzb25pZnktZXJyb3JcIik7XHJcbmNvbnN0IG92ZXJyaWRlQ29uc29sZSA9IHJlcXVpcmUoXCIuL2xpYi9vdmVycmlkZS1jb25zb2xlXCIpO1xyXG5jb25zdCBvdmVycmlkZUVycm9yTWV0aG9kcyA9IHJlcXVpcmUoXCIuL2xpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzXCIpO1xyXG5jb25zdCBsb2cgPSByZXF1aXJlKFwiLi9saWIvbG9nXCIpO1xyXG5jb25zdCB0b1N0cmluZyA9IHJlcXVpcmUoXCIuL2xpYi90by1zdHJpbmdcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25pZnlFcnJvcjtcclxubW9kdWxlLmV4cG9ydHMub3ZlcnJpZGVDb25zb2xlID0gb3ZlcnJpZGVDb25zb2xlO1xyXG5tb2R1bGUuZXhwb3J0cy5vdmVycmlkZUVycm9yTWV0aG9kcyA9IG92ZXJyaWRlRXJyb3JNZXRob2RzO1xyXG5tb2R1bGUuZXhwb3J0cy5sb2cgPSBsb2c7XHJcbm1vZHVsZS5leHBvcnRzLmFzU3RyaW5nID0gdG9TdHJpbmc7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCB0b1N0cmluZyA9IHJlcXVpcmUoXCIuLy4uL3RvLXN0cmluZ1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbG9nKGVycm9yLCBhbW91bnRPZlNwYWNlcyA9IDQpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IodG9TdHJpbmcoZXJyb3IsIGFtb3VudE9mU3BhY2VzKSk7XHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFN1cGVyY2xhc3NlcyhvYmopIHtcclxuICAgIGNvbnN0IHN1cGVyY2xhc3NlcyA9IFtdO1xyXG4gICAgbGV0IHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcclxuICAgIGlmICh0ZW1wICE9PSBudWxsKSB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xyXG4gICAgd2hpbGUgKHRlbXAgIT09IG51bGwpIHtcclxuICAgICAgICBzdXBlcmNsYXNzZXMucHVzaCh0ZW1wLmNvbnN0cnVjdG9yLm5hbWUpO1xyXG4gICAgICAgIHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGVtcCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3VwZXJjbGFzc2VzO1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgZ2V0U3VwZXJjbGFzc2VzID0gcmVxdWlyZShcIi4vZ2V0LXN1cGVyY2xhc3Nlc1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ganNvbmlmeUVycm9yKGVycm9yKSB7XHJcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkgcmV0dXJuIGVycm9yO1xyXG4gICAgY29uc3Qgd3JhcHBlZEVycm9yID0ge307XHJcbiAgICB3cmFwcGVkRXJyb3IubmFtZSA9IGVycm9yLm5hbWUgfHwgXCI8bm8gbmFtZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3IuY2xhc3NOYW1lID0gZXJyb3IuY29uc3RydWN0b3IubmFtZSB8fCBcIjxubyBjbGFzcyBuYW1lIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5tZXNzYWdlID0gZXJyb3IubWVzc2FnZSB8fCBcIjxubyBtZXNzYWdlIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5zdXBlcmNsYXNzZXMgPSBnZXRTdXBlcmNsYXNzZXMoZXJyb3IpO1xyXG4gICAgd3JhcHBlZEVycm9yLmVudW1lcmFibGVGaWVsZHMgPSB7fTtcclxuICAgIGZvciAoY29uc3QgeCBpbiBlcnJvcikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZXJyb3JbeF0gPT09IFwiZnVuY3Rpb25cIikgY29udGludWU7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLmVudW1lcmFibGVGaWVsZHNbeF0gPSBlcnJvclt4XTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZXJyb3Iuc3RhY2sgPT09IFwic3RyaW5nXCIgJiYgZXJyb3Iuc3RhY2subGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5zdGFjayA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5tYXAoeCA9PiB4LnJlcGxhY2UoL15cXHMrLywgXCJcIikpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjayB8fCBcIjxubyBzdGFjayB0cmFjZSBhdmFpbGFibGU+XCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd3JhcHBlZEVycm9yO1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgdG9TdHJpbmcgPSByZXF1aXJlKFwiLi90by1zdHJpbmdcIik7XHJcblxyXG5mdW5jdGlvbiBtYXBBcmdzKGFyZ3MpIHtcclxuICAgIHJldHVybiBhcmdzLm1hcChhcmcgPT4gYXJnIGluc3RhbmNlb2YgRXJyb3IgPyB0b1N0cmluZyhhcmcpIDogYXJnKTtcclxufVxyXG5cclxuY29uc3QgbWV0aG9kTmFtZXMgPSBbXCJsb2dcIiwgXCJkZWJ1Z1wiLCBcImluZm9cIiwgXCJ3YXJuXCIsIFwiZXJyb3JcIl07XHJcblxyXG5sZXQgYWxyZWFkeU92ZXJyaWRkZW4gPSBmYWxzZTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoYWxyZWFkeU92ZXJyaWRkZW4pIHJldHVybjtcclxuICAgIGFscmVhZHlPdmVycmlkZGVuID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBvcmlnaW5hbE1ldGhvZHMgPSB7fTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG1ldGhvZE5hbWUgb2YgbWV0aG9kTmFtZXMpIHtcclxuICAgICAgICBpZiAoIWNvbnNvbGVbbWV0aG9kTmFtZV0pIGNvbnRpbnVlO1xyXG4gICAgICAgIG9yaWdpbmFsTWV0aG9kc1ttZXRob2ROYW1lXSA9IGNvbnNvbGVbbWV0aG9kTmFtZV0uYmluZChjb25zb2xlKTtcclxuICAgICAgICBjb25zb2xlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oLi4uYXJncykge1xyXG4gICAgICAgICAgICBvcmlnaW5hbE1ldGhvZHNbbWV0aG9kTmFtZV0oLi4ubWFwQXJncyhhcmdzKSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2pzb25pZnktZXJyb3JcIik7XHJcbmNvbnN0IHRvU3RyaW5nID0gcmVxdWlyZShcIi4vdG8tc3RyaW5nXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHRoaXMgRXJyb3IgaW5zdGFuY2UgdG8gYSBKU09OIHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKi9cclxuICAgIEVycm9yLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ganNvbmlmeUVycm9yKHRoaXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHRoaXMgRXJyb3IgaW5zdGFuY2UgdG8gdGhlIGZ1bGwgc3RyaW5naWZpY2F0aW9uXHJcbiAgICAgKiBvZiBpdHMgSlNPTiByZXByZXNlbnRhdGlvbi5cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRPZlNwYWNlcz00XSBUaGUgYW1vdW50IG9mIHNwYWNlcyB0byB1c2VcclxuICAgICAqIGZvciBpbmRlbnRhdGlvbiBpbiB0aGUgb3V0cHV0IHN0cmluZy5cclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbihhbW91bnRPZlNwYWNlcyA9IDQpIHtcclxuICAgICAgICByZXR1cm4gdG9TdHJpbmcodGhpcywgYW1vdW50T2ZTcGFjZXMpO1xyXG4gICAgfTtcclxuXHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9qc29uaWZ5LWVycm9yXCIpO1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHRoZSBnaXZlbiBlcnJvciB0byBhIGJpZyBzdHJpbmcgcmVwcmVzZW50YXRpb24sIGNvbnRhaW5pbmdcclxuICogdGhlIHdob2xlIGRhdGEgZnJvbSBpdHMgSlNPTiByZXByZXNlbnRhdGlvbi5cclxuICogXHJcbiAqIEBwYXJhbSB7ZXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byBiZSBjb252ZXJ0ZWQuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50T2ZTcGFjZXM9NF0gVGhlIGFtb3VudCBvZiBzcGFjZXMgdG8gdXNlXHJcbiAqIGZvciBpbmRlbnRhdGlvbiBpbiB0aGUgb3V0cHV0IHN0cmluZy5cclxuICogXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICogQHRocm93cyB7VHlwZUVycm9yfSBJZiB0aGUgZ2l2ZW4gZXJyb3IgaXMgbm90IGFuIGluc3RhbmNlIG9mIEVycm9yXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvU3RyaW5nKGVycm9yLCBhbW91bnRPZlNwYWNlcyA9IDQpIHtcclxuICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwianNvbmlmeUVycm9yLnRvU3RyaW5nKCkgZXJyb3I6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgaW5zdGFuY2Ugb2YgRXJyb3IuXCIpO1xyXG4gICAgY29uc3QgYXNKU09OID0ganNvbmlmeUVycm9yKGVycm9yKTtcclxuICAgIHJldHVybiBgJHthc0pTT04uY2xhc3NOYW1lfTogJHthc0pTT04ubWVzc2FnZX0gJHtKU09OLnN0cmluZ2lmeShhc0pTT04sIG51bGwsIGFtb3VudE9mU3BhY2VzKX1gO1xyXG59OyJdfQ==
