(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

window.jsonifyError = require('./index.js');

},{"./index.js":2}],2:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getSuperclasses(obj) {
    var superclasses = [];
    var temp = Object.getPrototypeOf(obj);
    if (temp !== null) temp = Object.getPrototypeOf(temp);
    while (temp !== null) {
        superclasses.push(temp.constructor.name);
        temp = Object.getPrototypeOf(temp);
    }
    return superclasses;
}

function jsonifyError(error) {
    if (!(error instanceof Error)) return error;
    var wrappedError = {};
    wrappedError.name = error.name || "<no name available>";
    wrappedError.className = error.constructor.name || "<no class name available>";
    wrappedError.message = error.message || "<no message available>";
    wrappedError.superclasses = getSuperclasses(error);
    wrappedError.enumerableFields = {};
    for (var x in error) {
        wrappedError.enumerableFields[x] = error[x];
    }
    if (typeof error.stack === "string") {
        wrappedError.stack = error.stack.split('\n').map(function (x) {
            return x.replace(/^\s+/, "");
        });
    } else {
        wrappedError.stack = error.stack || "<no stack trace available>";
    }
    return wrappedError;
}

function mapArgs(args) {
    return args.map(function (arg) {
        return arg instanceof Error ? jsonifyError(arg) : arg;
    });
}

var alreadyOverridden = false;
jsonifyError.overrideConsole = function () {
    if (alreadyOverridden) return;
    alreadyOverridden = true;
    var defaultConsoleLog = console.log.bind(console);
    var defaultConsoleWarn = console.warn.bind(console);
    var defaultConsoleError = console.error.bind(console);
    console.log = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        defaultConsoleLog.apply(undefined, _toConsumableArray(mapArgs(args)));
    };
    console.warn = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        defaultConsoleWarn.apply(undefined, _toConsumableArray(mapArgs(args)));
    };
    console.error = function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        defaultConsoleError.apply(undefined, _toConsumableArray(mapArgs(args)));
    };
};

module.exports = jsonifyError;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUNBLE9BQU8sWUFBUCxHQUFzQixRQUFRLFlBQVIsQ0FBdEI7OztBQ0RBOzs7O0FBRUEsU0FBUyxlQUFULENBQXlCLEdBQXpCLEVBQThCO0FBQzFCLFFBQU0sZUFBZSxFQUFyQjtBQUNBLFFBQUksT0FBTyxPQUFPLGNBQVAsQ0FBc0IsR0FBdEIsQ0FBWDtBQUNBLFFBQUksU0FBUyxJQUFiLEVBQW1CLE9BQU8sT0FBTyxjQUFQLENBQXNCLElBQXRCLENBQVA7QUFDbkIsV0FBTyxTQUFTLElBQWhCLEVBQXNCO0FBQ2xCLHFCQUFhLElBQWIsQ0FBa0IsS0FBSyxXQUFMLENBQWlCLElBQW5DO0FBQ0EsZUFBTyxPQUFPLGNBQVAsQ0FBc0IsSUFBdEIsQ0FBUDtBQUNIO0FBQ0QsV0FBTyxZQUFQO0FBQ0g7O0FBRUQsU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTZCO0FBQ3pCLFFBQUksRUFBRSxpQkFBaUIsS0FBbkIsQ0FBSixFQUErQixPQUFPLEtBQVA7QUFDL0IsUUFBTSxlQUFlLEVBQXJCO0FBQ0EsaUJBQWEsSUFBYixHQUFvQixNQUFNLElBQU4sSUFBYyxxQkFBbEM7QUFDQSxpQkFBYSxTQUFiLEdBQXlCLE1BQU0sV0FBTixDQUFrQixJQUFsQixJQUEwQiwyQkFBbkQ7QUFDQSxpQkFBYSxPQUFiLEdBQXVCLE1BQU0sT0FBTixJQUFpQix3QkFBeEM7QUFDQSxpQkFBYSxZQUFiLEdBQTRCLGdCQUFnQixLQUFoQixDQUE1QjtBQUNBLGlCQUFhLGdCQUFiLEdBQWdDLEVBQWhDO0FBQ0EsU0FBSyxJQUFJLENBQVQsSUFBYyxLQUFkLEVBQXFCO0FBQ2pCLHFCQUFhLGdCQUFiLENBQThCLENBQTlCLElBQW1DLE1BQU0sQ0FBTixDQUFuQztBQUNIO0FBQ0QsUUFBSSxPQUFPLE1BQU0sS0FBYixLQUF1QixRQUEzQixFQUFxQztBQUNqQyxxQkFBYSxLQUFiLEdBQXFCLE1BQU0sS0FBTixDQUFZLEtBQVosQ0FBa0IsSUFBbEIsRUFBd0IsR0FBeEIsQ0FBNEI7QUFBQSxtQkFBSyxFQUFFLE9BQUYsQ0FBVSxNQUFWLEVBQWtCLEVBQWxCLENBQUw7QUFBQSxTQUE1QixDQUFyQjtBQUNILEtBRkQsTUFFTztBQUNILHFCQUFhLEtBQWIsR0FBcUIsTUFBTSxLQUFOLElBQWUsNEJBQXBDO0FBQ0g7QUFDRCxXQUFPLFlBQVA7QUFDSDs7QUFFRCxTQUFTLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUI7QUFDbkIsV0FBTyxLQUFLLEdBQUwsQ0FBUztBQUFBLGVBQU8sZUFBZSxLQUFmLEdBQXVCLGFBQWEsR0FBYixDQUF2QixHQUEyQyxHQUFsRDtBQUFBLEtBQVQsQ0FBUDtBQUNIOztBQUVELElBQUksb0JBQW9CLEtBQXhCO0FBQ0EsYUFBYSxlQUFiLEdBQStCLFlBQVc7QUFDdEMsUUFBSSxpQkFBSixFQUF1QjtBQUN2Qix3QkFBb0IsSUFBcEI7QUFDQSxRQUFNLG9CQUFvQixRQUFRLEdBQVIsQ0FBWSxJQUFaLENBQWlCLE9BQWpCLENBQTFCO0FBQ0EsUUFBTSxxQkFBcUIsUUFBUSxJQUFSLENBQWEsSUFBYixDQUFrQixPQUFsQixDQUEzQjtBQUNBLFFBQU0sc0JBQXNCLFFBQVEsS0FBUixDQUFjLElBQWQsQ0FBbUIsT0FBbkIsQ0FBNUI7QUFDQSxZQUFRLEdBQVIsR0FBYyxZQUFrQjtBQUFBLDBDQUFOLElBQU07QUFBTixnQkFBTTtBQUFBOztBQUM1Qiw4REFBcUIsUUFBUSxJQUFSLENBQXJCO0FBQ0gsS0FGRDtBQUdBLFlBQVEsSUFBUixHQUFlLFlBQWtCO0FBQUEsMkNBQU4sSUFBTTtBQUFOLGdCQUFNO0FBQUE7O0FBQzdCLCtEQUFzQixRQUFRLElBQVIsQ0FBdEI7QUFDSCxLQUZEO0FBR0EsWUFBUSxLQUFSLEdBQWdCLFlBQWtCO0FBQUEsMkNBQU4sSUFBTTtBQUFOLGdCQUFNO0FBQUE7O0FBQzlCLGdFQUF1QixRQUFRLElBQVIsQ0FBdkI7QUFDSCxLQUZEO0FBR0gsQ0FmRDs7QUFpQkEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbndpbmRvdy5qc29uaWZ5RXJyb3IgPSByZXF1aXJlKCcuL2luZGV4LmpzJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBnZXRTdXBlcmNsYXNzZXMob2JqKSB7XHJcbiAgICBjb25zdCBzdXBlcmNsYXNzZXMgPSBbXTtcclxuICAgIGxldCB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XHJcbiAgICBpZiAodGVtcCAhPT0gbnVsbCkgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0ZW1wKTtcclxuICAgIHdoaWxlICh0ZW1wICE9PSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXJjbGFzc2VzLnB1c2godGVtcC5jb25zdHJ1Y3Rvci5uYW1lKTtcclxuICAgICAgICB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN1cGVyY2xhc3NlcztcclxufVxyXG5cclxuZnVuY3Rpb24ganNvbmlmeUVycm9yKGVycm9yKSB7XHJcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkgcmV0dXJuIGVycm9yO1xyXG4gICAgY29uc3Qgd3JhcHBlZEVycm9yID0ge307XHJcbiAgICB3cmFwcGVkRXJyb3IubmFtZSA9IGVycm9yLm5hbWUgfHwgXCI8bm8gbmFtZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3IuY2xhc3NOYW1lID0gZXJyb3IuY29uc3RydWN0b3IubmFtZSB8fCBcIjxubyBjbGFzcyBuYW1lIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5tZXNzYWdlID0gZXJyb3IubWVzc2FnZSB8fCBcIjxubyBtZXNzYWdlIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5zdXBlcmNsYXNzZXMgPSBnZXRTdXBlcmNsYXNzZXMoZXJyb3IpO1xyXG4gICAgd3JhcHBlZEVycm9yLmVudW1lcmFibGVGaWVsZHMgPSB7fTtcclxuICAgIGZvciAobGV0IHggaW4gZXJyb3IpIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3IuZW51bWVyYWJsZUZpZWxkc1t4XSA9IGVycm9yW3hdO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBlcnJvci5zdGFjayA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5zdGFjayA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5tYXAoeCA9PiB4LnJlcGxhY2UoL15cXHMrLywgXCJcIikpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjayB8fCBcIjxubyBzdGFjayB0cmFjZSBhdmFpbGFibGU+XCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd3JhcHBlZEVycm9yO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXBBcmdzKGFyZ3MpIHtcclxuICAgIHJldHVybiBhcmdzLm1hcChhcmcgPT4gYXJnIGluc3RhbmNlb2YgRXJyb3IgPyBqc29uaWZ5RXJyb3IoYXJnKSA6IGFyZyk7XHJcbn1cclxuXHJcbmxldCBhbHJlYWR5T3ZlcnJpZGRlbiA9IGZhbHNlO1xyXG5qc29uaWZ5RXJyb3Iub3ZlcnJpZGVDb25zb2xlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoYWxyZWFkeU92ZXJyaWRkZW4pIHJldHVybjtcclxuICAgIGFscmVhZHlPdmVycmlkZGVuID0gdHJ1ZTtcclxuICAgIGNvbnN0IGRlZmF1bHRDb25zb2xlTG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcclxuICAgIGNvbnN0IGRlZmF1bHRDb25zb2xlV2FybiA9IGNvbnNvbGUud2Fybi5iaW5kKGNvbnNvbGUpO1xyXG4gICAgY29uc3QgZGVmYXVsdENvbnNvbGVFcnJvciA9IGNvbnNvbGUuZXJyb3IuYmluZChjb25zb2xlKTtcclxuICAgIGNvbnNvbGUubG9nID0gZnVuY3Rpb24oLi4uYXJncykge1xyXG4gICAgICAgIGRlZmF1bHRDb25zb2xlTG9nKC4uLm1hcEFyZ3MoYXJncykpO1xyXG4gICAgfTtcclxuICAgIGNvbnNvbGUud2FybiA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcclxuICAgICAgICBkZWZhdWx0Q29uc29sZVdhcm4oLi4ubWFwQXJncyhhcmdzKSk7XHJcbiAgICB9O1xyXG4gICAgY29uc29sZS5lcnJvciA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcclxuICAgICAgICBkZWZhdWx0Q29uc29sZUVycm9yKC4uLm1hcEFyZ3MoYXJncykpO1xyXG4gICAgfTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ganNvbmlmeUVycm9yOyJdfQ==
