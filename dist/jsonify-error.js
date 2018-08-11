(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
window.jsonifyError = require('./index.js');
},{"./index.js":2}],2:[function(require,module,exports){
"use strict";

function getSuperclasses(obj) {
    const superclasses = [];
    let temp = Object.getPrototypeOf(obj);
    if (temp !== null) temp = Object.getPrototypeOf(temp);
    while (temp !== null) {
        superclasses.push(temp.constructor.name);
        temp = Object.getPrototypeOf(temp);
    }
    return superclasses;
}

function jsonifyError(error) {
    if (!(error instanceof Error)) return error;
    const wrappedError = {};
    wrappedError.name = error.name || "<no name available>";
    wrappedError.message = error.message || "<no message available>";
    wrappedError.superclasses = getSuperclasses(error);
    wrappedError.enumerableFields = {};
    for (let x in error) {
        wrappedError.enumerableFields[x] = error[x];
    }
    if (typeof error.stack === "string") {
        wrappedError.stack = error.stack.split('\n').map(x => x.replace(/^\s+/, ""));
    } else {
        wrappedError.stack = error.stack || "<no stack trace available>";
    }
    return wrappedError;
}

function mapArgs(args) {
    return args.map(arg => arg instanceof Error ? jsonifyError(arg) : arg);
}

let alreadyOverridden = false;
jsonifyError.overrideConsole = function() {
    if (alreadyOverridden) return;
    alreadyOverridden = true;
    const defaultConsoleLog = console.log.bind(console);
    const defaultConsoleWarn = console.warn.bind(console);
    const defaultConsoleError = console.error.bind(console);
    console.log = function(...args) {
        defaultConsoleLog(...mapArgs(args));
    };
    console.warn = function(...args) {
        defaultConsoleWarn(...mapArgs(args));
    };
    console.error = function(...args) {
        defaultConsoleError(...mapArgs(args));
    };
};

module.exports = jsonifyError;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbndpbmRvdy5qc29uaWZ5RXJyb3IgPSByZXF1aXJlKCcuL2luZGV4LmpzJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBnZXRTdXBlcmNsYXNzZXMob2JqKSB7XHJcbiAgICBjb25zdCBzdXBlcmNsYXNzZXMgPSBbXTtcclxuICAgIGxldCB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XHJcbiAgICBpZiAodGVtcCAhPT0gbnVsbCkgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0ZW1wKTtcclxuICAgIHdoaWxlICh0ZW1wICE9PSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXJjbGFzc2VzLnB1c2godGVtcC5jb25zdHJ1Y3Rvci5uYW1lKTtcclxuICAgICAgICB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN1cGVyY2xhc3NlcztcclxufVxyXG5cclxuZnVuY3Rpb24ganNvbmlmeUVycm9yKGVycm9yKSB7XHJcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkgcmV0dXJuIGVycm9yO1xyXG4gICAgY29uc3Qgd3JhcHBlZEVycm9yID0ge307XHJcbiAgICB3cmFwcGVkRXJyb3IubmFtZSA9IGVycm9yLm5hbWUgfHwgXCI8bm8gbmFtZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3IubWVzc2FnZSA9IGVycm9yLm1lc3NhZ2UgfHwgXCI8bm8gbWVzc2FnZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3Iuc3VwZXJjbGFzc2VzID0gZ2V0U3VwZXJjbGFzc2VzKGVycm9yKTtcclxuICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzID0ge307XHJcbiAgICBmb3IgKGxldCB4IGluIGVycm9yKSB7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLmVudW1lcmFibGVGaWVsZHNbeF0gPSBlcnJvclt4XTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZXJyb3Iuc3RhY2sgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykubWFwKHggPT4geC5yZXBsYWNlKC9eXFxzKy8sIFwiXCIpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLnN0YWNrID0gZXJyb3Iuc3RhY2sgfHwgXCI8bm8gc3RhY2sgdHJhY2UgYXZhaWxhYmxlPlwiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdyYXBwZWRFcnJvcjtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFwQXJncyhhcmdzKSB7XHJcbiAgICByZXR1cm4gYXJncy5tYXAoYXJnID0+IGFyZyBpbnN0YW5jZW9mIEVycm9yID8ganNvbmlmeUVycm9yKGFyZykgOiBhcmcpO1xyXG59XHJcblxyXG5sZXQgYWxyZWFkeU92ZXJyaWRkZW4gPSBmYWxzZTtcclxuanNvbmlmeUVycm9yLm92ZXJyaWRlQ29uc29sZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGFscmVhZHlPdmVycmlkZGVuKSByZXR1cm47XHJcbiAgICBhbHJlYWR5T3ZlcnJpZGRlbiA9IHRydWU7XHJcbiAgICBjb25zdCBkZWZhdWx0Q29uc29sZUxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XHJcbiAgICBjb25zdCBkZWZhdWx0Q29uc29sZVdhcm4gPSBjb25zb2xlLndhcm4uYmluZChjb25zb2xlKTtcclxuICAgIGNvbnN0IGRlZmF1bHRDb25zb2xlRXJyb3IgPSBjb25zb2xlLmVycm9yLmJpbmQoY29uc29sZSk7XHJcbiAgICBjb25zb2xlLmxvZyA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcclxuICAgICAgICBkZWZhdWx0Q29uc29sZUxvZyguLi5tYXBBcmdzKGFyZ3MpKTtcclxuICAgIH07XHJcbiAgICBjb25zb2xlLndhcm4gPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcbiAgICAgICAgZGVmYXVsdENvbnNvbGVXYXJuKC4uLm1hcEFyZ3MoYXJncykpO1xyXG4gICAgfTtcclxuICAgIGNvbnNvbGUuZXJyb3IgPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcbiAgICAgICAgZGVmYXVsdENvbnNvbGVFcnJvciguLi5tYXBBcmdzKGFyZ3MpKTtcclxuICAgIH07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25pZnlFcnJvcjsiXX0=
