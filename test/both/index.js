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

    it('should find enumerable fields correctly', function() {
        const ErrorSubclass1 = class ErrorSubclass1 extends Error {};
        const ErrorSubclass2 = class ErrorSubclass2 extends ErrorSubclass1 {};
        ErrorSubclass2.prototype.someFieldX = 333;
        ErrorSubclass1.prototype.someFieldY = 555;
        const e = new ErrorSubclass2("Some message");
        e.someFieldZ = 777;
        const jsonified = jsonifyError(e);
        expect(jsonified.enumerableFields).to.deep.equal({
            someFieldX: 333,
            someFieldY: 555,
            someFieldZ: 777
        });
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