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