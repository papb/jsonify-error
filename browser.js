"use strict";
function jsonifyError(error) {
    var superclasses = [];
    var temp = Object.getPrototypeOf(Object.getPrototypeOf(error));
    while (temp !== null) {
        superclasses.push(temp.constructor.name);
        temp = Object.getPrototypeOf(temp);
    }
    var wrappedError = {};
    wrappedError.name = error.name;
    wrappedError.message = error.message;
    wrappedError.superclasses = superclasses;
    wrappedError.enumerableFields = {};
    for (let x in error) {
        wrappedError.enumerableFields[x] = error[x];
    }
    wrappedError.stack = error.stack.split('\n').map(x => x.replace(/^\s+/, ""));
    return wrappedError;
};