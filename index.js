"use strict";
module.exports = function(error) {
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
};
function mapArgs(args) {
    return args.map(arg => {
        if (arg instanceof Error) return module.exports(arg);
        return arg;
    });
}
module.exports.overrideConsole = function() {
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
}