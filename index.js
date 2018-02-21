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