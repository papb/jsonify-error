(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

window.jsonifyError = require('./index.js');

},{"./index.js":2}],2:[function(require,module,exports){
"use strict";

var jsonifyError = require("./lib/jsonify-error");
var overrideConsole = require("./lib/override-console");
var overrideErrorMethods = require("./lib/override-error-methods");
var log = require("./lib/log");

module.exports = jsonifyError;
module.exports.overrideConsole = overrideConsole;
module.exports.overrideErrorMethods = overrideErrorMethods;
module.exports.log = log;

},{"./lib/jsonify-error":5,"./lib/log":3,"./lib/override-console":6,"./lib/override-error-methods":7}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJpbmRleC5qcyIsImxpYi9icm93c2VyLXNwZWNpZmljL2xvZy5qcyIsImxpYi9nZXQtc3VwZXJjbGFzc2VzLmpzIiwibGliL2pzb25pZnktZXJyb3IuanMiLCJsaWIvb3ZlcnJpZGUtY29uc29sZS5qcyIsImxpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzLmpzIiwibGliL3RvLXN0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUNBLE9BQU8sWUFBUCxHQUFzQixRQUFRLFlBQVIsQ0FBdEI7OztBQ0RBOztBQUVBLElBQU0sZUFBZSxRQUFRLHFCQUFSLENBQXJCO0FBQ0EsSUFBTSxrQkFBa0IsUUFBUSx3QkFBUixDQUF4QjtBQUNBLElBQU0sdUJBQXVCLFFBQVEsOEJBQVIsQ0FBN0I7QUFDQSxJQUFNLE1BQU0sUUFBUSxXQUFSLENBQVo7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCO0FBQ0EsT0FBTyxPQUFQLENBQWUsZUFBZixHQUFpQyxlQUFqQztBQUNBLE9BQU8sT0FBUCxDQUFlLG9CQUFmLEdBQXNDLG9CQUF0QztBQUNBLE9BQU8sT0FBUCxDQUFlLEdBQWYsR0FBcUIsR0FBckI7OztBQ1ZBOztBQUVBLElBQU0sV0FBVyxRQUFRLGdCQUFSLENBQWpCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixTQUFTLEdBQVQsQ0FBYSxLQUFiLEVBQXdDO0FBQUEsUUFBcEIsY0FBb0IsdUVBQUgsQ0FBRzs7QUFDckQsWUFBUSxLQUFSLENBQWMsU0FBUyxLQUFULEVBQWdCLGNBQWhCLENBQWQ7QUFDSCxDQUZEOzs7QUNKQTs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxlQUFULENBQXlCLEdBQXpCLEVBQThCO0FBQzNDLFFBQU0sZUFBZSxFQUFyQjtBQUNBLFFBQUksT0FBTyxPQUFPLGNBQVAsQ0FBc0IsR0FBdEIsQ0FB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O0FBQUE7QUFBQTtBQUFBO0FBYTNCLENBYkQ7OztBQ1pBOztBQUVBLElBQU0sZUFBZSxRQUFRLGlCQUFSLENBQXJCO0FBQ0EsSUFBTSxXQUFXLFFBQVEsYUFBUixDQUFqQjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsWUFBVzs7QUFFeEI7Ozs7O0FBS0EsVUFBTSxTQUFOLENBQWdCLE1BQWhCLEdBQXlCLFlBQVc7QUFDaEMsZUFBTyxhQUFhLElBQWIsQ0FBUDtBQUNILEtBRkQ7O0FBSUE7Ozs7Ozs7OztBQVNBLFVBQU0sU0FBTixDQUFnQixRQUFoQixHQUEyQixZQUE2QjtBQUFBLFlBQXBCLGNBQW9CLHVFQUFILENBQUc7O0FBQ3BELGVBQU8sU0FBUyxJQUFULEVBQWUsY0FBZixDQUFQO0FBQ0gsS0FGRDtBQUlILENBeEJEOzs7QUNMQTs7QUFFQSxJQUFNLGVBQWUsUUFBUSxpQkFBUixDQUFyQjs7QUFFQTs7Ozs7Ozs7Ozs7QUFXQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxRQUFULENBQWtCLEtBQWxCLEVBQTZDO0FBQUEsTUFBcEIsY0FBb0IsdUVBQUgsQ0FBRzs7QUFDMUQsTUFBSSxFQUFFLGlCQUFpQixLQUFuQixDQUFKLEVBQStCLE1BQU0sSUFBSSxTQUFKLENBQWMsMEVBQWQsQ0FBTjtBQUMvQixNQUFNLFNBQVMsYUFBYSxLQUFiLENBQWY7QUFDQSxTQUFVLE9BQU8sU0FBakIsVUFBK0IsT0FBTyxPQUF0QyxTQUFpRCxLQUFLLFNBQUwsQ0FBZSxNQUFmLEVBQXVCLElBQXZCLEVBQTZCLGNBQTdCLENBQWpEO0FBQ0gsQ0FKRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xyXG53aW5kb3cuanNvbmlmeUVycm9yID0gcmVxdWlyZSgnLi9pbmRleC5qcycpOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vbGliL2pzb25pZnktZXJyb3JcIik7XHJcbmNvbnN0IG92ZXJyaWRlQ29uc29sZSA9IHJlcXVpcmUoXCIuL2xpYi9vdmVycmlkZS1jb25zb2xlXCIpO1xyXG5jb25zdCBvdmVycmlkZUVycm9yTWV0aG9kcyA9IHJlcXVpcmUoXCIuL2xpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzXCIpO1xyXG5jb25zdCBsb2cgPSByZXF1aXJlKFwiLi9saWIvbG9nXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBqc29uaWZ5RXJyb3I7XHJcbm1vZHVsZS5leHBvcnRzLm92ZXJyaWRlQ29uc29sZSA9IG92ZXJyaWRlQ29uc29sZTtcclxubW9kdWxlLmV4cG9ydHMub3ZlcnJpZGVFcnJvck1ldGhvZHMgPSBvdmVycmlkZUVycm9yTWV0aG9kcztcclxubW9kdWxlLmV4cG9ydHMubG9nID0gbG9nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgdG9TdHJpbmcgPSByZXF1aXJlKFwiLi8uLi90by1zdHJpbmdcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxvZyhlcnJvciwgYW1vdW50T2ZTcGFjZXMgPSA0KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKHRvU3RyaW5nKGVycm9yLCBhbW91bnRPZlNwYWNlcykpO1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRTdXBlcmNsYXNzZXMob2JqKSB7XHJcbiAgICBjb25zdCBzdXBlcmNsYXNzZXMgPSBbXTtcclxuICAgIGxldCB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XHJcbiAgICBpZiAodGVtcCAhPT0gbnVsbCkgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0ZW1wKTtcclxuICAgIHdoaWxlICh0ZW1wICE9PSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXJjbGFzc2VzLnB1c2godGVtcC5jb25zdHJ1Y3Rvci5uYW1lKTtcclxuICAgICAgICB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN1cGVyY2xhc3NlcztcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGdldFN1cGVyY2xhc3NlcyA9IHJlcXVpcmUoXCIuL2dldC1zdXBlcmNsYXNzZXNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGpzb25pZnlFcnJvcihlcnJvcikge1xyXG4gICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHJldHVybiBlcnJvcjtcclxuICAgIGNvbnN0IHdyYXBwZWRFcnJvciA9IHt9O1xyXG4gICAgd3JhcHBlZEVycm9yLm5hbWUgPSBlcnJvci5uYW1lIHx8IFwiPG5vIG5hbWUgYXZhaWxhYmxlPlwiO1xyXG4gICAgd3JhcHBlZEVycm9yLmNsYXNzTmFtZSA9IGVycm9yLmNvbnN0cnVjdG9yLm5hbWUgfHwgXCI8bm8gY2xhc3MgbmFtZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3IubWVzc2FnZSA9IGVycm9yLm1lc3NhZ2UgfHwgXCI8bm8gbWVzc2FnZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3Iuc3VwZXJjbGFzc2VzID0gZ2V0U3VwZXJjbGFzc2VzKGVycm9yKTtcclxuICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzID0ge307XHJcbiAgICBmb3IgKGNvbnN0IHggaW4gZXJyb3IpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGVycm9yW3hdID09PSBcImZ1bmN0aW9uXCIpIGNvbnRpbnVlO1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzW3hdID0gZXJyb3JbeF07XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrID09PSBcInN0cmluZ1wiICYmIGVycm9yLnN0YWNrLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykubWFwKHggPT4geC5yZXBsYWNlKC9eXFxzKy8sIFwiXCIpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2sgfHwgXCI8bm8gc3RhY2sgdHJhY2UgYXZhaWxhYmxlPlwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdyYXBwZWRFcnJvcjtcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IHRvU3RyaW5nID0gcmVxdWlyZShcIi4vdG8tc3RyaW5nXCIpO1xyXG5cclxuZnVuY3Rpb24gbWFwQXJncyhhcmdzKSB7XHJcbiAgICByZXR1cm4gYXJncy5tYXAoYXJnID0+IGFyZyBpbnN0YW5jZW9mIEVycm9yID8gdG9TdHJpbmcoYXJnKSA6IGFyZyk7XHJcbn1cclxuXHJcbmNvbnN0IG1ldGhvZE5hbWVzID0gW1wibG9nXCIsIFwiZGVidWdcIiwgXCJpbmZvXCIsIFwid2FyblwiLCBcImVycm9yXCJdO1xyXG5cclxubGV0IGFscmVhZHlPdmVycmlkZGVuID0gZmFsc2U7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGFscmVhZHlPdmVycmlkZGVuKSByZXR1cm47XHJcbiAgICBhbHJlYWR5T3ZlcnJpZGRlbiA9IHRydWU7XHJcblxyXG4gICAgY29uc3Qgb3JpZ2luYWxNZXRob2RzID0ge307XHJcblxyXG4gICAgZm9yIChjb25zdCBtZXRob2ROYW1lIG9mIG1ldGhvZE5hbWVzKSB7XHJcbiAgICAgICAgaWYgKCFjb25zb2xlW21ldGhvZE5hbWVdKSBjb250aW51ZTtcclxuICAgICAgICBvcmlnaW5hbE1ldGhvZHNbbWV0aG9kTmFtZV0gPSBjb25zb2xlW21ldGhvZE5hbWVdLmJpbmQoY29uc29sZSk7XHJcbiAgICAgICAgY29uc29sZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcclxuICAgICAgICAgICAgb3JpZ2luYWxNZXRob2RzW21ldGhvZE5hbWVdKC4uLm1hcEFyZ3MoYXJncykpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9qc29uaWZ5LWVycm9yXCIpO1xyXG5jb25zdCB0b1N0cmluZyA9IHJlcXVpcmUoXCIuL3RvLXN0cmluZ1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB0aGlzIEVycm9yIGluc3RhbmNlIHRvIGEgSlNPTiByZXByZXNlbnRhdGlvbi5cclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBFcnJvci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGpzb25pZnlFcnJvcih0aGlzKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyB0aGlzIEVycm9yIGluc3RhbmNlIHRvIHRoZSBmdWxsIHN0cmluZ2lmaWNhdGlvblxyXG4gICAgICogb2YgaXRzIEpTT04gcmVwcmVzZW50YXRpb24uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50T2ZTcGFjZXM9NF0gVGhlIGFtb3VudCBvZiBzcGFjZXMgdG8gdXNlXHJcbiAgICAgKiBmb3IgaW5kZW50YXRpb24gaW4gdGhlIG91dHB1dCBzdHJpbmcuXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cclxuICAgICAqL1xyXG4gICAgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oYW1vdW50T2ZTcGFjZXMgPSA0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRvU3RyaW5nKHRoaXMsIGFtb3VudE9mU3BhY2VzKTtcclxuICAgIH07XHJcblxyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vanNvbmlmeS1lcnJvclwiKTtcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB0aGUgZ2l2ZW4gZXJyb3IgdG8gYSBiaWcgc3RyaW5nIHJlcHJlc2VudGF0aW9uLCBjb250YWluaW5nXHJcbiAqIHRoZSB3aG9sZSBkYXRhIGZyb20gaXRzIEpTT04gcmVwcmVzZW50YXRpb24uXHJcbiAqIFxyXG4gKiBAcGFyYW0ge2Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gYmUgY29udmVydGVkLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2Ftb3VudE9mU3BhY2VzPTRdIFRoZSBhbW91bnQgb2Ygc3BhY2VzIHRvIHVzZVxyXG4gKiBmb3IgaW5kZW50YXRpb24gaW4gdGhlIG91dHB1dCBzdHJpbmcuXHJcbiAqIFxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gSWYgdGhlIGdpdmVuIGVycm9yIGlzIG5vdCBhbiBpbnN0YW5jZSBvZiBFcnJvclxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b1N0cmluZyhlcnJvciwgYW1vdW50T2ZTcGFjZXMgPSA0KSB7XHJcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcImpzb25pZnlFcnJvci50b1N0cmluZygpIGVycm9yOiBGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGluc3RhbmNlIG9mIEVycm9yLlwiKTtcclxuICAgIGNvbnN0IGFzSlNPTiA9IGpzb25pZnlFcnJvcihlcnJvcik7XHJcbiAgICByZXR1cm4gYCR7YXNKU09OLmNsYXNzTmFtZX06ICR7YXNKU09OLm1lc3NhZ2V9ICR7SlNPTi5zdHJpbmdpZnkoYXNKU09OLCBudWxsLCBhbW91bnRPZlNwYWNlcyl9YDtcclxufTsiXX0=
