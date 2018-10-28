"use strict";

const chai = require('chai');
const expect = chai.expect;

describe('jsonifyError', function() {

    it('should detect jsonifyError', function() {
        expect(!!window.jsonifyError).to.equal(true);
    });

    it('should wrap correctly', function() {
        const ErrorSubclass = class ErrorSubclass extends Error {};
        const e = new ErrorSubclass("Some message");
        const jsonified = window.jsonifyError(e);
        expect(jsonified).to.deep.include({
            name: "Error",
            className: "ErrorSubclass",
            message: "Some message",
            superclasses: ["Error", "Object"],
            enumerableFields: {}
        });
        expect(jsonified.stack).to.be.an("array");
        expect(jsonified.stack[0]).to.equal("Error: Some message");
    });

});