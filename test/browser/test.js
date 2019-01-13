"use strict";

const chai = require('chai');
const expect = chai.expect;
const testsForBoth = require('./../both');

const jsonifyError = window.jsonifyError;

describe('jsonifyError', function() {

    describe('specifically for browsers', function() {

        it('should detect jsonifyError', function() {
            expect(!!jsonifyError).to.equal(true);
        });

    });

    describe('for both node and browser', testsForBoth({
        jsonifyError,
        it,
        expect
    }));

});