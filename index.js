"use strict";

const jsonifyError = require("./lib/jsonify-error");
const overrideConsole = require("./lib/override-console");
const log = require("./lib/log");

module.exports = jsonifyError;
module.exports.overrideConsole = overrideConsole;
module.exports.log = log;