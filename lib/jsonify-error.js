"use strict";

const getSuperclasses = require("./get-superclasses");

const stripColorsIfString = require("./strip-colors-if-string");

module.exports = function jsonifyError(error) {
    if (!(error instanceof Error)) return error;
    const wrappedError = {};
    wrappedError.name = error.name || "<no name available>";
    wrappedError.className = error.constructor.name || "<no class name available>";
    wrappedError.message = stripColorsIfString(error.message) || "<no message available>";
    wrappedError.superclasses = getSuperclasses(error);
    wrappedError.enumerableFields = {};
    for (const x in error) {
        if (typeof error[x] === "function") continue;
        wrappedError.enumerableFields[x] = stripColorsIfString(error[x]);
    }
    if (typeof error.stack === "string" && error.stack.length > 0) {
        wrappedError.stack = error.stack.split('\n').map(x => x.replace(/^\s+/, "")).filter(x => x).map(stripColorsIfString);
    } else {
        wrappedError.stack = stripColorsIfString(error.stack) || "<no stack trace available>";
    }
    return wrappedError;
};