(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function jsonifyError(error) {
    var superclasses = [];
    var temp = Object.getPrototypeOf(error);
    if (temp !== null) temp = Object.getPrototypeOf(temp);
    while (temp !== null) {
        superclasses.push(temp.constructor.name);
        temp = Object.getPrototypeOf(temp);
    }
    var wrappedError = {};
    wrappedError.name = error.name || "<no name available>";
    wrappedError.message = error.message || "<no message available>";
    wrappedError.superclasses = superclasses;
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
        if (arg instanceof Error) return module.exports(arg);
        return arg;
    });
}

var alreadyOverridden = false;
jsonifyError.overrideConsole = function () {
    if (alreadyOverridden) return;
    alreadyOverridden = true;
    var defaultConsoleLog = console.log;
    var defaultConsoleWarn = console.warn;
    var defaultConsoleError = console.error;
    console.log = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        defaultConsoleLog.apply(null, mapArgs(args));
    };
    console.warn = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        defaultConsoleWarn.apply(null, mapArgs(args));
    };
    console.error = function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        defaultConsoleError.apply(null, mapArgs(args));
    };
};

module.exports = jsonifyError;

},{}],2:[function(require,module,exports){
"use strict";

window.jsonifyError = require('./index.js');

},{"./index.js":1}]},{},[2]);
