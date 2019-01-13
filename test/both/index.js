"use strict";

module.exports = ({ jsonifyError, it, expect }) => function() {

    it('should wrap correctly', function() {
        const ErrorSubclass = class ErrorSubclass extends Error {};
        const e = new ErrorSubclass("Some message");
        const jsonified = jsonifyError(e);
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

    it('should override error methods correctly', function() {
        const ErrorSubclass = class ErrorSubclass extends Error {};
        const e = new ErrorSubclass("Some message");
        jsonifyError.overrideErrorMethods();

        const jsonified = e.toJSON();
        expect(jsonified).to.deep.include({
            name: "Error",
            className: "ErrorSubclass",
            message: "Some message",
            superclasses: ["Error", "Object"],
            enumerableFields: {}
        });
        expect(jsonified.stack).to.be.an("array");
        expect(jsonified.stack[0]).to.equal("Error: Some message");
        
        expect(e.toString(7)).to.match(/^ErrorSubclass: Some message {\n {7}"name": "Error"/);
    });

};