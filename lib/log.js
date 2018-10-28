"use strict";

const toString = require("./to-string");
const chalk = require("chalk");

module.exports = function log(error, amountOfSpaces = 4) {
    console.error(chalk.red(toString(error, amountOfSpaces)));
};