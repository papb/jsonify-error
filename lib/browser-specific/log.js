"use strict";

const toString = require("./../to-string");

module.exports = function log(error, amountOfSpaces = 4) {
    console.error(toString(error, amountOfSpaces));
};