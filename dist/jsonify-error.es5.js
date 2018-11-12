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

},{"./lib/jsonify-error":6,"./lib/log":3,"./lib/override-console":7,"./lib/override-error-methods":8,"./lib/to-string":9}],3:[function(require,module,exports){
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

},{"./get-superclasses":5}],7:[function(require,module,exports){
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

},{"./jsonify-error":6,"./to-string":9}],9:[function(require,module,exports){
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

},{"./jsonify-error":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJpbmRleC5qcyIsImxpYi9icm93c2VyLXNwZWNpZmljL2xvZy5qcyIsImxpYi9icm93c2VyLXNwZWNpZmljL21hcC1hcmcuanMiLCJsaWIvZ2V0LXN1cGVyY2xhc3Nlcy5qcyIsImxpYi9qc29uaWZ5LWVycm9yLmpzIiwibGliL292ZXJyaWRlLWNvbnNvbGUuanMiLCJsaWIvb3ZlcnJpZGUtZXJyb3ItbWV0aG9kcy5qcyIsImxpYi90by1zdHJpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFDQSxPQUFPLFlBQVAsR0FBc0IsUUFBUSxZQUFSLENBQXRCOzs7QUNEQTs7QUFFQSxJQUFNLGVBQWUsUUFBUSxxQkFBUixDQUFyQjtBQUNBLElBQU0sa0JBQWtCLFFBQVEsd0JBQVIsQ0FBeEI7QUFDQSxJQUFNLHVCQUF1QixRQUFRLDhCQUFSLENBQTdCO0FBQ0EsSUFBTSxNQUFNLFFBQVEsV0FBUixDQUFaO0FBQ0EsSUFBTSxXQUFXLFFBQVEsaUJBQVIsQ0FBakI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCO0FBQ0EsT0FBTyxPQUFQLENBQWUsZUFBZixHQUFpQyxlQUFqQztBQUNBLE9BQU8sT0FBUCxDQUFlLG9CQUFmLEdBQXNDLG9CQUF0QztBQUNBLE9BQU8sT0FBUCxDQUFlLEdBQWYsR0FBcUIsR0FBckI7QUFDQSxPQUFPLE9BQVAsQ0FBZSxRQUFmLEdBQTBCLFFBQTFCOzs7QUNaQTs7QUFFQSxJQUFNLFNBQVMsUUFBUSxjQUFSLENBQWY7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFNBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0I7QUFDakM7QUFDQSxZQUFRLEtBQVIsQ0FBYyxPQUFPLEtBQVAsQ0FBZDtBQUNILENBSEQ7OztBQ0pBOztBQUVBLElBQU0sZUFBZSxRQUFRLG9CQUFSLENBQXJCOztBQUVBLE9BQU8sT0FB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LDhIQUFzQztBQUFBLGdCQUEzQixVQUEyQjs7QUFBQSw2QkFBM0IsVUFBMkI7O0FBQUEscUNBQ1I7QUFLN0I7QUFadUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWEzQyxDQWJEOzs7QUNSQTs7QUFFQSxJQUFNLGVBQWUsUUFBUSxpQkFBUixDQUFyQjtBQUNBLElBQU0sV0FBVyxRQUFRLGFBQVIsQ0FBakI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFlBQVc7O0FBRXhCOzs7OztBQUtBLFVBQU0sU0FBTixDQUFnQixNQUFoQixHQUF5QixZQUFXO0FBQ2hDLGVBQU8sYUFBYSxJQUFiLENBQVA7QUFDSCxLQUZEOztBQUlBOzs7Ozs7Ozs7QUFTQSxVQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsR0FBMkIsWUFBNkI7QUFBQSxZQUFwQixjQUFvQix1RUFBSCxDQUFHOztBQUNwRCxlQUFPLFNBQVMsSUFBVCxFQUFlLGNBQWYsQ0FBUDtBQUNILEtBRkQ7QUFJSCxDQXhCRDs7O0FDTEE7O0FBRUEsSUFBTSxlQUFlLFFBQVEsaUJBQVIsQ0FBckI7O0FBRUE7Ozs7Ozs7Ozs7O0FBV0EsT0FBTyxPQUFQLEdBQWlCLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUE2QztBQUFBLE1BQXBCLGNBQW9CLHVFQUFILENBQUc7O0FBQzFELE1BQUksRUFBRSxpQkFBaUIsS0FBbkIsQ0FBSixFQUErQixNQUFNLElBQUksU0FBSixDQUFjLDBFQUFkLENBQU47QUFDL0IsTUFBTSxTQUFTLGFBQWEsS0FBYixDQUFmO0FBQ0EsU0FBVSxPQUFPLFNBQWpCLFVBQStCLE9BQU8sT0FBdEMsU0FBaUQsS0FBSyxTQUFMLENBQWUsTUFBZixFQUF1QixJQUF2QixFQUE2QixjQUE3QixDQUFqRDtBQUNILENBSkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxud2luZG93Lmpzb25pZnlFcnJvciA9IHJlcXVpcmUoJy4vaW5kZXguanMnKTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2xpYi9qc29uaWZ5LWVycm9yXCIpO1xyXG5jb25zdCBvdmVycmlkZUNvbnNvbGUgPSByZXF1aXJlKFwiLi9saWIvb3ZlcnJpZGUtY29uc29sZVwiKTtcclxuY29uc3Qgb3ZlcnJpZGVFcnJvck1ldGhvZHMgPSByZXF1aXJlKFwiLi9saWIvb3ZlcnJpZGUtZXJyb3ItbWV0aG9kc1wiKTtcclxuY29uc3QgbG9nID0gcmVxdWlyZShcIi4vbGliL2xvZ1wiKTtcclxuY29uc3QgdG9TdHJpbmcgPSByZXF1aXJlKFwiLi9saWIvdG8tc3RyaW5nXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBqc29uaWZ5RXJyb3I7XHJcbm1vZHVsZS5leHBvcnRzLm92ZXJyaWRlQ29uc29sZSA9IG92ZXJyaWRlQ29uc29sZTtcclxubW9kdWxlLmV4cG9ydHMub3ZlcnJpZGVFcnJvck1ldGhvZHMgPSBvdmVycmlkZUVycm9yTWV0aG9kcztcclxubW9kdWxlLmV4cG9ydHMubG9nID0gbG9nO1xyXG5tb2R1bGUuZXhwb3J0cy5hc1N0cmluZyA9IHRvU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgbWFwQXJnID0gcmVxdWlyZShcIi4vLi4vbWFwLWFyZ1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbG9nKGVycm9yKSB7XHJcbiAgICAvLyBJbiBicm93c2Vycywgd2UgZG8gbm90IGNvbG9yaXplIHRoZSBlcnJvciB3aXRoIGNoYWxrLlxyXG4gICAgY29uc29sZS5lcnJvcihtYXBBcmcoZXJyb3IpKTtcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuLy4uL2pzb25pZnktZXJyb3JcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hcEFyZyhhcmcpIHtcclxuICAgIC8vIEluIGJyb3dzZXJzLCB3ZSBjb252ZXJ0IHRoZSBlcnJvciB0byBKU09OIGJ1dCBub3QgdG8gc3RyaW5nLCBzaW5jZSB0aGUgYnJvd3NlcidzXHJcbiAgICAvLyBjb25zb2xlIGlzIGludGVyYWN0aXZlIGFuZCBhbGxvd3MgaW5zcGVjdGluZyB0aGUgcGxhaW4gb2JqZWN0IGVhc2lseS5cclxuICAgIHJldHVybiBhcmcgaW5zdGFuY2VvZiBFcnJvciA/IGpzb25pZnlFcnJvcihhcmcpIDogYXJnO1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRTdXBlcmNsYXNzZXMob2JqKSB7XHJcbiAgICBjb25zdCBzdXBlcmNsYXNzZXMgPSBbXTtcclxuICAgIGxldCB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XHJcbiAgICBpZiAodGVtcCAhPT0gbnVsbCkgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0ZW1wKTtcclxuICAgIHdoaWxlICh0ZW1wICE9PSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXJjbGFzc2VzLnB1c2godGVtcC5jb25zdHJ1Y3Rvci5uYW1lKTtcclxuICAgICAgICB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN1cGVyY2xhc3NlcztcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGdldFN1cGVyY2xhc3NlcyA9IHJlcXVpcmUoXCIuL2dldC1zdXBlcmNsYXNzZXNcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGpzb25pZnlFcnJvcihlcnJvcikge1xyXG4gICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHJldHVybiBlcnJvcjtcclxuICAgIGNvbnN0IHdyYXBwZWRFcnJvciA9IHt9O1xyXG4gICAgd3JhcHBlZEVycm9yLm5hbWUgPSBlcnJvci5uYW1lIHx8IFwiPG5vIG5hbWUgYXZhaWxhYmxlPlwiO1xyXG4gICAgd3JhcHBlZEVycm9yLmNsYXNzTmFtZSA9IGVycm9yLmNvbnN0cnVjdG9yLm5hbWUgfHwgXCI8bm8gY2xhc3MgbmFtZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3IubWVzc2FnZSA9IGVycm9yLm1lc3NhZ2UgfHwgXCI8bm8gbWVzc2FnZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3Iuc3VwZXJjbGFzc2VzID0gZ2V0U3VwZXJjbGFzc2VzKGVycm9yKTtcclxuICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzID0ge307XHJcbiAgICBmb3IgKGNvbnN0IHggaW4gZXJyb3IpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGVycm9yW3hdID09PSBcImZ1bmN0aW9uXCIpIGNvbnRpbnVlO1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzW3hdID0gZXJyb3JbeF07XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrID09PSBcInN0cmluZ1wiICYmIGVycm9yLnN0YWNrLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykubWFwKHggPT4geC5yZXBsYWNlKC9eXFxzKy8sIFwiXCIpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2sgfHwgXCI8bm8gc3RhY2sgdHJhY2UgYXZhaWxhYmxlPlwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdyYXBwZWRFcnJvcjtcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IG1hcEFyZyA9IHJlcXVpcmUoXCIuL21hcC1hcmdcIik7XHJcblxyXG5jb25zdCBtZXRob2ROYW1lcyA9IFtcImxvZ1wiLCBcImRlYnVnXCIsIFwiaW5mb1wiLCBcIndhcm5cIiwgXCJlcnJvclwiXTtcclxuXHJcbmxldCBhbHJlYWR5T3ZlcnJpZGRlbiA9IGZhbHNlO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvdmVycmlkZUNvbnNvbGUoKSB7XHJcbiAgICBpZiAoYWxyZWFkeU92ZXJyaWRkZW4pIHJldHVybjtcclxuICAgIGFscmVhZHlPdmVycmlkZGVuID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBvcmlnaW5hbE1ldGhvZHMgPSB7fTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG1ldGhvZE5hbWUgb2YgbWV0aG9kTmFtZXMpIHtcclxuICAgICAgICBpZiAoIWNvbnNvbGVbbWV0aG9kTmFtZV0pIGNvbnRpbnVlO1xyXG4gICAgICAgIG9yaWdpbmFsTWV0aG9kc1ttZXRob2ROYW1lXSA9IGNvbnNvbGVbbWV0aG9kTmFtZV0uYmluZChjb25zb2xlKTtcclxuICAgICAgICBjb25zb2xlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oLi4uYXJncykge1xyXG4gICAgICAgICAgICBvcmlnaW5hbE1ldGhvZHNbbWV0aG9kTmFtZV0oLi4uYXJncy5tYXAobWFwQXJnKSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2pzb25pZnktZXJyb3JcIik7XHJcbmNvbnN0IHRvU3RyaW5nID0gcmVxdWlyZShcIi4vdG8tc3RyaW5nXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHRoaXMgRXJyb3IgaW5zdGFuY2UgdG8gYSBKU09OIHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKi9cclxuICAgIEVycm9yLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ganNvbmlmeUVycm9yKHRoaXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHRoaXMgRXJyb3IgaW5zdGFuY2UgdG8gdGhlIGZ1bGwgc3RyaW5naWZpY2F0aW9uXHJcbiAgICAgKiBvZiBpdHMgSlNPTiByZXByZXNlbnRhdGlvbi5cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRPZlNwYWNlcz00XSBUaGUgYW1vdW50IG9mIHNwYWNlcyB0byB1c2VcclxuICAgICAqIGZvciBpbmRlbnRhdGlvbiBpbiB0aGUgb3V0cHV0IHN0cmluZy5cclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbihhbW91bnRPZlNwYWNlcyA9IDQpIHtcclxuICAgICAgICByZXR1cm4gdG9TdHJpbmcodGhpcywgYW1vdW50T2ZTcGFjZXMpO1xyXG4gICAgfTtcclxuXHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9qc29uaWZ5LWVycm9yXCIpO1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHRoZSBnaXZlbiBlcnJvciB0byBhIGJpZyBzdHJpbmcgcmVwcmVzZW50YXRpb24sIGNvbnRhaW5pbmdcclxuICogdGhlIHdob2xlIGRhdGEgZnJvbSBpdHMgSlNPTiByZXByZXNlbnRhdGlvbi5cclxuICogXHJcbiAqIEBwYXJhbSB7ZXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byBiZSBjb252ZXJ0ZWQuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50T2ZTcGFjZXM9NF0gVGhlIGFtb3VudCBvZiBzcGFjZXMgdG8gdXNlXHJcbiAqIGZvciBpbmRlbnRhdGlvbiBpbiB0aGUgb3V0cHV0IHN0cmluZy5cclxuICogXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICogQHRocm93cyB7VHlwZUVycm9yfSBJZiB0aGUgZ2l2ZW4gZXJyb3IgaXMgbm90IGFuIGluc3RhbmNlIG9mIEVycm9yXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvU3RyaW5nKGVycm9yLCBhbW91bnRPZlNwYWNlcyA9IDQpIHtcclxuICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwianNvbmlmeUVycm9yLnRvU3RyaW5nKCkgZXJyb3I6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgaW5zdGFuY2Ugb2YgRXJyb3IuXCIpO1xyXG4gICAgY29uc3QgYXNKU09OID0ganNvbmlmeUVycm9yKGVycm9yKTtcclxuICAgIHJldHVybiBgJHthc0pTT04uY2xhc3NOYW1lfTogJHthc0pTT04ubWVzc2FnZX0gJHtKU09OLnN0cmluZ2lmeShhc0pTT04sIG51bGwsIGFtb3VudE9mU3BhY2VzKX1gO1xyXG59OyJdfQ==
