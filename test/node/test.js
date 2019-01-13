"use strict";

const chai = require('chai');
const expect = chai.expect;
const testsForBoth = require('./../both');

const jsonifyError = require("./../../index");

describe('jsonifyError', function() {

    // describe('specifically for node', function() {
    // 
    // });

    describe('for both node and browser', testsForBoth({
        jsonifyError,
        it,
        expect
    }));

});