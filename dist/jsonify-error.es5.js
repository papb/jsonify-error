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
    if (typeof error.stack === "string" && error.stack.length > 0) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUNBLE9BQU8sWUFBUCxHQUFzQixRQUFRLFlBQVIsQ0FBdEI7OztBQ0RBOzs7O0FBRUEsU0FBUyxlQUFULENBQXlCLEdBQXpCLEVBQThCO0FBQzFCLFFBQU0sZUFBZSxFQUFyQjtBQUNBLFFBQUksT0FBTyxPQUFPLGNBQVAsQ0FBc0IsR0FBdEIsQ0FBWDtBQUNBLFFBQUksU0FBUyxJQUFiLEVBQW1CLE9BQU8sT0FBTyxjQUFQLENBQXNCLElBQXRCLENBQVA7QUFDbkIsV0FBTyxTQUFTLElBQWhCLEVBQXNCO0FBQ2xCLHFCQUFhLElBQWIsQ0FBa0IsS0FBSyxXQUFMLENBQWlCLElBQW5DO0FBQ0EsZUFBTyxPQUFPLGNBQVAsQ0FBc0IsSUFBdEIsQ0FBUDtBQUNIO0FBQ0QsV0FBTyxZQUFQO0FBQ0g7O0FBRUQsU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTZCO0FBQ3pCLFFBQUksRUFBRSxpQkFBaUIsS0FBbkIsQ0FBSixFQUErQixPQUFPLEtBQVA7QUFDL0IsUUFBTSxlQUFlLEVBQXJCO0FBQ0EsaUJBQWEsSUFBYixHQUFvQixNQUFNLElBQU4sSUFBYyxxQkFBbEM7QUFDQSxpQkFBYSxTQUFiLEdBQXlCLE1BQU0sV0FBTixDQUFrQixJQUFsQixJQUEwQiwyQkFBbkQ7QUFDQSxpQkFBYSxPQUFiLEdBQXVCLE1BQU0sT0FBTixJQUFpQix3QkFBeEM7QUFDQSxpQkFBYSxZQUFiLEdBQTRCLGdCQUFnQixLQUFoQixDQUE1QjtBQUNBLGlCQUFhLGdCQUFiLEdBQWdDLEVBQWhDO0FBQ0EsU0FBSyxJQUFJLENBQVQsSUFBYyxLQUFkLEVBQXFCO0FBQ2pCLHFCQUFhLGdCQUFiLENBQThCLENBQTlCLElBQW1DLE1BQU0sQ0FBTixDQUFuQztBQUNIO0FBQ0QsUUFBSSxPQUFPLE1BQU0sS0FBYixLQUF1QixRQUF2QixJQUFtQyxNQUFNLEtBQU4sQ0FBWSxNQUFaLEdBQXFCLENBQTVELEVBQStEO0FBQzNELHFCQUFhLEtBQWIsR0FBcUIsTUFBTSxLQUFOLENBQVksS0FBWixDQUFrQixJQUFsQixFQUF3QixHQUF4QixDQUE0QjtBQUFBLG1CQUFLLEVBQUUsT0FBRixDQUFVLE1BQVYsRUFBa0IsRUFBbEIsQ0FBTDtBQUFBLFNBQTVCLENBQXJCO0FBQ0gsS0FGRCxNQUVPO0FBQ0gscUJBQWEsS0FBYixHQUFxQixNQUFNLEtBQU4sSUFBZSw0QkFBcEM7QUFDSDtBQUNELFdBQU8sWUFBUDtBQUNIOztBQUVELFNBQVMsT0FBVCxDQUFpQixJQUFqQixFQUF1QjtBQUNuQixXQUFPLEtBQUssR0FBTCxDQUFTO0FBQUEsZUFBTyxlQUFlLEtBQWYsR0FBdUIsYUFBYSxHQUFiLENBQXZCLEdBQTJDLEdBQWxEO0FBQUEsS0FBVCxDQUFQO0FBQ0g7O0FBRUQsSUFBSSxvQkFBb0IsS0FBeEI7QUFDQSxhQUFhLGVBQWIsR0FBK0IsWUFBVztBQUN0QyxRQUFJLGlCQUFKLEVBQXVCO0FBQ3ZCLHdCQUFvQixJQUFwQjtBQUNBLFFBQU0sb0JBQW9CLFFBQVEsR0FBUixDQUFZLElBQVosQ0FBaUIsT0FBakIsQ0FBMUI7QUFDQSxRQUFNLHFCQUFxQixRQUFRLElBQVIsQ0FBYSxJQUFiLENBQWtCLE9BQWxCLENBQTNCO0FBQ0EsUUFBTSxzQkFBc0IsUUFBUSxLQUFSLENBQWMsSUFBZCxDQUFtQixPQUFuQixDQUE1QjtBQUNBLFlBQVEsR0FBUixHQUFjLFlBQWtCO0FBQUEsMENBQU4sSUFBTTtBQUFOLGdCQUFNO0FBQUE7O0FBQzVCLDhEQUFxQixRQUFRLElBQVIsQ0FBckI7QUFDSCxLQUZEO0FBR0EsWUFBUSxJQUFSLEdBQWUsWUFBa0I7QUFBQSwyQ0FBTixJQUFNO0FBQU4sZ0JBQU07QUFBQTs7QUFDN0IsK0RBQXNCLFFBQVEsSUFBUixDQUF0QjtBQUNILEtBRkQ7QUFHQSxZQUFRLEtBQVIsR0FBZ0IsWUFBa0I7QUFBQSwyQ0FBTixJQUFNO0FBQU4sZ0JBQU07QUFBQTs7QUFDOUIsZ0VBQXVCLFFBQVEsSUFBUixDQUF2QjtBQUNILEtBRkQ7QUFHSCxDQWZEOztBQWlCQSxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxud2luZG93Lmpzb25pZnlFcnJvciA9IHJlcXVpcmUoJy4vaW5kZXguanMnKTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIGdldFN1cGVyY2xhc3NlcyhvYmopIHtcclxuICAgIGNvbnN0IHN1cGVyY2xhc3NlcyA9IFtdO1xyXG4gICAgbGV0IHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcclxuICAgIGlmICh0ZW1wICE9PSBudWxsKSB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xyXG4gICAgd2hpbGUgKHRlbXAgIT09IG51bGwpIHtcclxuICAgICAgICBzdXBlcmNsYXNzZXMucHVzaCh0ZW1wLmNvbnN0cnVjdG9yLm5hbWUpO1xyXG4gICAgICAgIHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGVtcCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3VwZXJjbGFzc2VzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBqc29uaWZ5RXJyb3IoZXJyb3IpIHtcclxuICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSByZXR1cm4gZXJyb3I7XHJcbiAgICBjb25zdCB3cmFwcGVkRXJyb3IgPSB7fTtcclxuICAgIHdyYXBwZWRFcnJvci5uYW1lID0gZXJyb3IubmFtZSB8fCBcIjxubyBuYW1lIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5jbGFzc05hbWUgPSBlcnJvci5jb25zdHJ1Y3Rvci5uYW1lIHx8IFwiPG5vIGNsYXNzIG5hbWUgYXZhaWxhYmxlPlwiO1xyXG4gICAgd3JhcHBlZEVycm9yLm1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlIHx8IFwiPG5vIG1lc3NhZ2UgYXZhaWxhYmxlPlwiO1xyXG4gICAgd3JhcHBlZEVycm9yLnN1cGVyY2xhc3NlcyA9IGdldFN1cGVyY2xhc3NlcyhlcnJvcik7XHJcbiAgICB3cmFwcGVkRXJyb3IuZW51bWVyYWJsZUZpZWxkcyA9IHt9O1xyXG4gICAgZm9yIChsZXQgeCBpbiBlcnJvcikge1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzW3hdID0gZXJyb3JbeF07XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrID09PSBcInN0cmluZ1wiICYmIGVycm9yLnN0YWNrLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykubWFwKHggPT4geC5yZXBsYWNlKC9eXFxzKy8sIFwiXCIpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2sgfHwgXCI8bm8gc3RhY2sgdHJhY2UgYXZhaWxhYmxlPlwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdyYXBwZWRFcnJvcjtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFwQXJncyhhcmdzKSB7XHJcbiAgICByZXR1cm4gYXJncy5tYXAoYXJnID0+IGFyZyBpbnN0YW5jZW9mIEVycm9yID8ganNvbmlmeUVycm9yKGFyZykgOiBhcmcpO1xyXG59XHJcblxyXG5sZXQgYWxyZWFkeU92ZXJyaWRkZW4gPSBmYWxzZTtcclxuanNvbmlmeUVycm9yLm92ZXJyaWRlQ29uc29sZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGFscmVhZHlPdmVycmlkZGVuKSByZXR1cm47XHJcbiAgICBhbHJlYWR5T3ZlcnJpZGRlbiA9IHRydWU7XHJcbiAgICBjb25zdCBkZWZhdWx0Q29uc29sZUxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XHJcbiAgICBjb25zdCBkZWZhdWx0Q29uc29sZVdhcm4gPSBjb25zb2xlLndhcm4uYmluZChjb25zb2xlKTtcclxuICAgIGNvbnN0IGRlZmF1bHRDb25zb2xlRXJyb3IgPSBjb25zb2xlLmVycm9yLmJpbmQoY29uc29sZSk7XHJcbiAgICBjb25zb2xlLmxvZyA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcclxuICAgICAgICBkZWZhdWx0Q29uc29sZUxvZyguLi5tYXBBcmdzKGFyZ3MpKTtcclxuICAgIH07XHJcbiAgICBjb25zb2xlLndhcm4gPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcbiAgICAgICAgZGVmYXVsdENvbnNvbGVXYXJuKC4uLm1hcEFyZ3MoYXJncykpO1xyXG4gICAgfTtcclxuICAgIGNvbnNvbGUuZXJyb3IgPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcbiAgICAgICAgZGVmYXVsdENvbnNvbGVFcnJvciguLi5tYXBBcmdzKGFyZ3MpKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25pZnlFcnJvcjsiXX0=
