(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function jsonifyError(error) {
    var superclasses = [];
    var temp = Object.getPrototypeOf(Object.getPrototypeOf(error));
    while (temp !== null) {
        superclasses.push(temp.constructor.name);
        temp = Object.getPrototypeOf(temp);
    }
    var wrappedError = {};
    wrappedError.name = error.name;
    wrappedError.message = error.message;
    wrappedError.superclasses = superclasses;
    wrappedError.enumerableFields = {};
    for (let x in error) {
        wrappedError.enumerableFields[x] = error[x];
    }
    wrappedError.stack = error.stack.split('\n').map(x => x.replace(/^\s+/, ""));
    return wrappedError;
}

function mapArgs(args) {
    return args.map(arg => {
        if (arg instanceof Error) return module.exports(arg);
        return arg;
    });
}

var alreadyOverridden = false;
jsonifyError.overrideConsole = function() {
    if (alreadyOverridden) return;
    alreadyOverridden = true;
    var defaultConsoleLog = console.log;
    var defaultConsoleWarn = console.warn;
    var defaultConsoleError = console.error;
    console.log = function(...args) {
        defaultConsoleLog.apply(null, mapArgs(args));
    };
    console.warn = function(...args) {
        defaultConsoleWarn.apply(null, mapArgs(args));
    };
    console.error = function(...args) {
        defaultConsoleError.apply(null, mapArgs(args));
    };
};

module.exports = jsonifyError;
},{}],2:[function(require,module,exports){
"use strict";
window.jsonifyError = require('./index.js');
},{"./index.js":1}]},{},[2]);
