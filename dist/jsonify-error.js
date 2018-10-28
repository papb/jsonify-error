(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
window.jsonifyError = require('./index.js');
},{"./index.js":2}],2:[function(require,module,exports){
"use strict";

const jsonifyError = require("./lib/jsonify-error");
const overrideConsole = require("./lib/override-console");
const overrideErrorMethods = require("./lib/override-error-methods");
const log = require("./lib/log");

module.exports = jsonifyError;
module.exports.overrideConsole = overrideConsole;
module.exports.overrideErrorMethods = overrideErrorMethods;
module.exports.log = log;
},{"./lib/jsonify-error":5,"./lib/log":3,"./lib/override-console":6,"./lib/override-error-methods":7}],3:[function(require,module,exports){
"use strict";

const toString = require("./../to-string");

module.exports = function log(error, amountOfSpaces = 4) {
    console.error(toString(error, amountOfSpaces));
};
},{"./../to-string":8}],4:[function(require,module,exports){
"use strict";

module.exports = function getSuperclasses(obj) {
    const superclasses = [];
    let temp = Object.getPrototypeOf(obj);
    if (temp !== null) temp = Object.getPrototypeOf(temp);
    while (temp !== null) {
        superclasses.push(temp.constructor.name);
        temp = Object.getPrototypeOf(temp);
    }
    return superclasses;
};
},{}],5:[function(require,module,exports){
"use strict";

const getSuperclasses = require("./get-superclasses");

module.exports = function jsonifyError(error) {
    if (!(error instanceof Error)) return error;
    const wrappedError = {};
    wrappedError.name = error.name || "<no name available>";
    wrappedError.className = error.constructor.name || "<no class name available>";
    wrappedError.message = error.message || "<no message available>";
    wrappedError.superclasses = getSuperclasses(error);
    wrappedError.enumerableFields = {};
    for (const x in error) {
        if (typeof error[x] === "function") continue;
        wrappedError.enumerableFields[x] = error[x];
    }
    if (typeof error.stack === "string" && error.stack.length > 0) {
        wrappedError.stack = error.stack.split('\n').map(x => x.replace(/^\s+/, ""));
    } else {
        wrappedError.stack = error.stack || "<no stack trace available>";
    }
    return wrappedError;
};
},{"./get-superclasses":4}],6:[function(require,module,exports){
"use strict";

const toString = require("./to-string");

function mapArgs(args) {
    return args.map(arg => arg instanceof Error ? toString(arg) : arg);
}

const methodNames = ["log", "debug", "info", "warn", "error"];

let alreadyOverridden = false;

module.exports = function() {
    if (alreadyOverridden) return;
    alreadyOverridden = true;

    const originalMethods = {};

    for (const methodName of methodNames) {
        if (!console[methodName]) continue;
        originalMethods[methodName] = console[methodName].bind(console);
        console[methodName] = function(...args) {
            originalMethods[methodName](...mapArgs(args));
        };
    }
};
},{"./to-string":8}],7:[function(require,module,exports){
"use strict";

const jsonifyError = require("./jsonify-error");
const toString = require("./to-string");

module.exports = function() {

    /**
     * Converts this Error instance to a JSON representation.
     * 
     * @return {object}
     */
    Error.prototype.toJSON = function() {
        return jsonifyError(this);
    };

    /**
     * Converts this Error instance to the full stringification
     * of its JSON representation.
     * 
     * @param {number} [amountOfSpaces=4] The amount of spaces to use
     * for indentation in the output string.
     * 
     * @return {string}
     */
    Error.prototype.toString = function(amountOfSpaces = 4) {
        return toString(this, amountOfSpaces);
    };

};
},{"./jsonify-error":5,"./to-string":8}],8:[function(require,module,exports){
"use strict";

const jsonifyError = require("./jsonify-error");

/**
 * Converts the given error to a big string representation, containing
 * the whole data from its JSON representation.
 * 
 * @param {error} error The error to be converted.
 * @param {number} [amountOfSpaces=4] The amount of spaces to use
 * for indentation in the output string.
 * 
 * @return {string}
 * @throws {TypeError} If the given error is not an instance of Error
 */
module.exports = function toString(error, amountOfSpaces = 4) {
    if (!(error instanceof Error)) throw new TypeError("jsonifyError.toString() error: First argument must be instance of Error.");
    const asJSON = jsonifyError(error);
    return `${asJSON.className}: ${asJSON.message} ${JSON.stringify(asJSON, null, amountOfSpaces)}`;
};
},{"./jsonify-error":5}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJpbmRleC5qcyIsImxpYi9icm93c2VyLXNwZWNpZmljL2xvZy5qcyIsImxpYi9nZXQtc3VwZXJjbGFzc2VzLmpzIiwibGliL2pzb25pZnktZXJyb3IuanMiLCJsaWIvb3ZlcnJpZGUtY29uc29sZS5qcyIsImxpYi9vdmVycmlkZS1lcnJvci1tZXRob2RzLmpzIiwibGliL3RvLXN0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbndpbmRvdy5qc29uaWZ5RXJyb3IgPSByZXF1aXJlKCcuL2luZGV4LmpzJyk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9saWIvanNvbmlmeS1lcnJvclwiKTtcclxuY29uc3Qgb3ZlcnJpZGVDb25zb2xlID0gcmVxdWlyZShcIi4vbGliL292ZXJyaWRlLWNvbnNvbGVcIik7XHJcbmNvbnN0IG92ZXJyaWRlRXJyb3JNZXRob2RzID0gcmVxdWlyZShcIi4vbGliL292ZXJyaWRlLWVycm9yLW1ldGhvZHNcIik7XHJcbmNvbnN0IGxvZyA9IHJlcXVpcmUoXCIuL2xpYi9sb2dcIik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25pZnlFcnJvcjtcclxubW9kdWxlLmV4cG9ydHMub3ZlcnJpZGVDb25zb2xlID0gb3ZlcnJpZGVDb25zb2xlO1xyXG5tb2R1bGUuZXhwb3J0cy5vdmVycmlkZUVycm9yTWV0aG9kcyA9IG92ZXJyaWRlRXJyb3JNZXRob2RzO1xyXG5tb2R1bGUuZXhwb3J0cy5sb2cgPSBsb2c7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCB0b1N0cmluZyA9IHJlcXVpcmUoXCIuLy4uL3RvLXN0cmluZ1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbG9nKGVycm9yLCBhbW91bnRPZlNwYWNlcyA9IDQpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IodG9TdHJpbmcoZXJyb3IsIGFtb3VudE9mU3BhY2VzKSk7XHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldFN1cGVyY2xhc3NlcyhvYmopIHtcclxuICAgIGNvbnN0IHN1cGVyY2xhc3NlcyA9IFtdO1xyXG4gICAgbGV0IHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcclxuICAgIGlmICh0ZW1wICE9PSBudWxsKSB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRlbXApO1xyXG4gICAgd2hpbGUgKHRlbXAgIT09IG51bGwpIHtcclxuICAgICAgICBzdXBlcmNsYXNzZXMucHVzaCh0ZW1wLmNvbnN0cnVjdG9yLm5hbWUpO1xyXG4gICAgICAgIHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGVtcCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3VwZXJjbGFzc2VzO1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgZ2V0U3VwZXJjbGFzc2VzID0gcmVxdWlyZShcIi4vZ2V0LXN1cGVyY2xhc3Nlc1wiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ganNvbmlmeUVycm9yKGVycm9yKSB7XHJcbiAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIEVycm9yKSkgcmV0dXJuIGVycm9yO1xyXG4gICAgY29uc3Qgd3JhcHBlZEVycm9yID0ge307XHJcbiAgICB3cmFwcGVkRXJyb3IubmFtZSA9IGVycm9yLm5hbWUgfHwgXCI8bm8gbmFtZSBhdmFpbGFibGU+XCI7XHJcbiAgICB3cmFwcGVkRXJyb3IuY2xhc3NOYW1lID0gZXJyb3IuY29uc3RydWN0b3IubmFtZSB8fCBcIjxubyBjbGFzcyBuYW1lIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5tZXNzYWdlID0gZXJyb3IubWVzc2FnZSB8fCBcIjxubyBtZXNzYWdlIGF2YWlsYWJsZT5cIjtcclxuICAgIHdyYXBwZWRFcnJvci5zdXBlcmNsYXNzZXMgPSBnZXRTdXBlcmNsYXNzZXMoZXJyb3IpO1xyXG4gICAgd3JhcHBlZEVycm9yLmVudW1lcmFibGVGaWVsZHMgPSB7fTtcclxuICAgIGZvciAoY29uc3QgeCBpbiBlcnJvcikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZXJyb3JbeF0gPT09IFwiZnVuY3Rpb25cIikgY29udGludWU7XHJcbiAgICAgICAgd3JhcHBlZEVycm9yLmVudW1lcmFibGVGaWVsZHNbeF0gPSBlcnJvclt4XTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZXJyb3Iuc3RhY2sgPT09IFwic3RyaW5nXCIgJiYgZXJyb3Iuc3RhY2subGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHdyYXBwZWRFcnJvci5zdGFjayA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5tYXAoeCA9PiB4LnJlcGxhY2UoL15cXHMrLywgXCJcIikpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjayB8fCBcIjxubyBzdGFjayB0cmFjZSBhdmFpbGFibGU+XCI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd3JhcHBlZEVycm9yO1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuY29uc3QgdG9TdHJpbmcgPSByZXF1aXJlKFwiLi90by1zdHJpbmdcIik7XHJcblxyXG5mdW5jdGlvbiBtYXBBcmdzKGFyZ3MpIHtcclxuICAgIHJldHVybiBhcmdzLm1hcChhcmcgPT4gYXJnIGluc3RhbmNlb2YgRXJyb3IgPyB0b1N0cmluZyhhcmcpIDogYXJnKTtcclxufVxyXG5cclxuY29uc3QgbWV0aG9kTmFtZXMgPSBbXCJsb2dcIiwgXCJkZWJ1Z1wiLCBcImluZm9cIiwgXCJ3YXJuXCIsIFwiZXJyb3JcIl07XHJcblxyXG5sZXQgYWxyZWFkeU92ZXJyaWRkZW4gPSBmYWxzZTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoYWxyZWFkeU92ZXJyaWRkZW4pIHJldHVybjtcclxuICAgIGFscmVhZHlPdmVycmlkZGVuID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBvcmlnaW5hbE1ldGhvZHMgPSB7fTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG1ldGhvZE5hbWUgb2YgbWV0aG9kTmFtZXMpIHtcclxuICAgICAgICBpZiAoIWNvbnNvbGVbbWV0aG9kTmFtZV0pIGNvbnRpbnVlO1xyXG4gICAgICAgIG9yaWdpbmFsTWV0aG9kc1ttZXRob2ROYW1lXSA9IGNvbnNvbGVbbWV0aG9kTmFtZV0uYmluZChjb25zb2xlKTtcclxuICAgICAgICBjb25zb2xlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oLi4uYXJncykge1xyXG4gICAgICAgICAgICBvcmlnaW5hbE1ldGhvZHNbbWV0aG9kTmFtZV0oLi4ubWFwQXJncyhhcmdzKSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IGpzb25pZnlFcnJvciA9IHJlcXVpcmUoXCIuL2pzb25pZnktZXJyb3JcIik7XHJcbmNvbnN0IHRvU3RyaW5nID0gcmVxdWlyZShcIi4vdG8tc3RyaW5nXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHRoaXMgRXJyb3IgaW5zdGFuY2UgdG8gYSBKU09OIHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKi9cclxuICAgIEVycm9yLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ganNvbmlmeUVycm9yKHRoaXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnRzIHRoaXMgRXJyb3IgaW5zdGFuY2UgdG8gdGhlIGZ1bGwgc3RyaW5naWZpY2F0aW9uXHJcbiAgICAgKiBvZiBpdHMgSlNPTiByZXByZXNlbnRhdGlvbi5cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFthbW91bnRPZlNwYWNlcz00XSBUaGUgYW1vdW50IG9mIHNwYWNlcyB0byB1c2VcclxuICAgICAqIGZvciBpbmRlbnRhdGlvbiBpbiB0aGUgb3V0cHV0IHN0cmluZy5cclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxyXG4gICAgICovXHJcbiAgICBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbihhbW91bnRPZlNwYWNlcyA9IDQpIHtcclxuICAgICAgICByZXR1cm4gdG9TdHJpbmcodGhpcywgYW1vdW50T2ZTcGFjZXMpO1xyXG4gICAgfTtcclxuXHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9qc29uaWZ5LWVycm9yXCIpO1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHRoZSBnaXZlbiBlcnJvciB0byBhIGJpZyBzdHJpbmcgcmVwcmVzZW50YXRpb24sIGNvbnRhaW5pbmdcclxuICogdGhlIHdob2xlIGRhdGEgZnJvbSBpdHMgSlNPTiByZXByZXNlbnRhdGlvbi5cclxuICogXHJcbiAqIEBwYXJhbSB7ZXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byBiZSBjb252ZXJ0ZWQuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50T2ZTcGFjZXM9NF0gVGhlIGFtb3VudCBvZiBzcGFjZXMgdG8gdXNlXHJcbiAqIGZvciBpbmRlbnRhdGlvbiBpbiB0aGUgb3V0cHV0IHN0cmluZy5cclxuICogXHJcbiAqIEByZXR1cm4ge3N0cmluZ31cclxuICogQHRocm93cyB7VHlwZUVycm9yfSBJZiB0aGUgZ2l2ZW4gZXJyb3IgaXMgbm90IGFuIGluc3RhbmNlIG9mIEVycm9yXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRvU3RyaW5nKGVycm9yLCBhbW91bnRPZlNwYWNlcyA9IDQpIHtcclxuICAgIGlmICghKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwianNvbmlmeUVycm9yLnRvU3RyaW5nKCkgZXJyb3I6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgaW5zdGFuY2Ugb2YgRXJyb3IuXCIpO1xyXG4gICAgY29uc3QgYXNKU09OID0ganNvbmlmeUVycm9yKGVycm9yKTtcclxuICAgIHJldHVybiBgJHthc0pTT04uY2xhc3NOYW1lfTogJHthc0pTT04ubWVzc2FnZX0gJHtKU09OLnN0cmluZ2lmeShhc0pTT04sIG51bGwsIGFtb3VudE9mU3BhY2VzKX1gO1xyXG59OyJdfQ==
