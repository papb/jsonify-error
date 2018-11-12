"use strict";

const toString = require("./to-string");

module.exports = function mapArg(arg) {
    // In node, we convert the error to string so that it is fully
    // readable in the console.
    return arg instanceof Error ? toString(arg) : arg;
};