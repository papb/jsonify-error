"use strict";

const jsonifyError = require("./lib/jsonify-error");
const overrideConsole = require("./lib/override-console");

module.exports = jsonifyError;
module.exports.overrideConsole = overrideConsole;