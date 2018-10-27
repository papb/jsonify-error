"use strict";

const jsonifyError = require("./jsonify-error");

function mapArgs(args) {
    return args.map(arg => arg instanceof Error ? jsonifyError(arg) : arg);
}

const methodNames = ["log", "debug", "info", "warn", "error"];

let alreadyOverridden = false;

module.exports = function() {
    if (alreadyOverridden) return;
    alreadyOverridden = true;

    const originalMethods = {};

    for (const methodName of methodNames) {
        originalMethods[methodName] = console[methodName].bind(console);
        console[methodName] = function(...args) {
            originalMethods[methodName](...mapArgs(args));
        };
    }
};