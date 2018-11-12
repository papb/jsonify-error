"use strict";

const mapArg = require("./map-arg");
const chalk = require("chalk");

module.exports = function log(error) {
    // In node, we colorize the error with chalk.
    console.error(chalk.red(mapArg(error)));
};