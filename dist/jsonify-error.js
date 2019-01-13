(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
window.jsonifyError = require('./index.js');
},{"./index.js":2}],2:[function(require,module,exports){
"use strict";

const jsonifyError = require("./lib/jsonify-error");
const overrideConsole = require("./lib/override-console");
const overrideErrorMethods = require("./lib/override-error-methods");
const log = require("./lib/log");
const toString = require("./lib/to-string");

module.exports = jsonifyError;
module.exports.overrideConsole = overrideConsole;
module.exports.overrideErrorMethods = overrideErrorMethods;
module.exports.log = log;
module.exports.asString = toString;
},{"./lib/jsonify-error":6,"./lib/log":3,"./lib/override-console":7,"./lib/override-error-methods":8,"./lib/to-string":9}],3:[function(require,module,exports){
"use strict";

const mapArg = require("./../map-arg");

module.exports = function log(error) {
    // In browsers, we do not colorize the error with chalk.
    console.error(mapArg(error));
};
},{"./../map-arg":4}],4:[function(require,module,exports){
"use strict";

const jsonifyError = require("./../jsonify-error");

module.exports = function mapArg(arg) {
    // In browsers, we convert the error to JSON but not to string, since the browser's
    // console is interactive and allows inspecting the plain object easily.
    return arg instanceof Error ? jsonifyError(arg) : arg;
};
},{"./../jsonify-error":6}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
        wrappedError.stack = error.stack.split('\n').map(x => x.replace(/^\s+/, "")).filter(x => x);
    } else {
        wrappedError.stack = error.stack || "<no stack trace available>";
    }
    return wrappedError;
};
},{"./get-superclasses":5}],7:[function(require,module,exports){
"use strict";

const mapArg = require("./map-arg");

const methodNames = ["log", "debug", "info", "warn", "error"];

let alreadyOverridden = false;

module.exports = function overrideConsole() {
    if (alreadyOverridden) return;
    alreadyOverridden = true;

    const originalMethods = {};

    for (const methodName of methodNames) {
        if (!console[methodName]) continue;
        originalMethods[methodName] = console[methodName].bind(console);
        console[methodName] = function(...args) {
            originalMethods[methodName](...args.map(mapArg));
        };
    }
};
},{"./map-arg":4}],8:[function(require,module,exports){
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
},{"./jsonify-error":6,"./to-string":9}],9:[function(require,module,exports){
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
},{"./jsonify-error":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyLWVudHJ5cG9pbnQuanMiLCJpbmRleC5qcyIsImxpYi9icm93c2VyLXNwZWNpZmljL2xvZy5qcyIsImxpYi9icm93c2VyLXNwZWNpZmljL21hcC1hcmcuanMiLCJsaWIvZ2V0LXN1cGVyY2xhc3Nlcy5qcyIsImxpYi9qc29uaWZ5LWVycm9yLmpzIiwibGliL292ZXJyaWRlLWNvbnNvbGUuanMiLCJsaWIvb3ZlcnJpZGUtZXJyb3ItbWV0aG9kcy5qcyIsImxpYi90by1zdHJpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG53aW5kb3cuanNvbmlmeUVycm9yID0gcmVxdWlyZSgnLi9pbmRleC5qcycpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9saWIvanNvbmlmeS1lcnJvclwiKTtcbmNvbnN0IG92ZXJyaWRlQ29uc29sZSA9IHJlcXVpcmUoXCIuL2xpYi9vdmVycmlkZS1jb25zb2xlXCIpO1xuY29uc3Qgb3ZlcnJpZGVFcnJvck1ldGhvZHMgPSByZXF1aXJlKFwiLi9saWIvb3ZlcnJpZGUtZXJyb3ItbWV0aG9kc1wiKTtcbmNvbnN0IGxvZyA9IHJlcXVpcmUoXCIuL2xpYi9sb2dcIik7XG5jb25zdCB0b1N0cmluZyA9IHJlcXVpcmUoXCIuL2xpYi90by1zdHJpbmdcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ganNvbmlmeUVycm9yO1xubW9kdWxlLmV4cG9ydHMub3ZlcnJpZGVDb25zb2xlID0gb3ZlcnJpZGVDb25zb2xlO1xubW9kdWxlLmV4cG9ydHMub3ZlcnJpZGVFcnJvck1ldGhvZHMgPSBvdmVycmlkZUVycm9yTWV0aG9kcztcbm1vZHVsZS5leHBvcnRzLmxvZyA9IGxvZztcbm1vZHVsZS5leHBvcnRzLmFzU3RyaW5nID0gdG9TdHJpbmc7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IG1hcEFyZyA9IHJlcXVpcmUoXCIuLy4uL21hcC1hcmdcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbG9nKGVycm9yKSB7XG4gICAgLy8gSW4gYnJvd3NlcnMsIHdlIGRvIG5vdCBjb2xvcml6ZSB0aGUgZXJyb3Igd2l0aCBjaGFsay5cbiAgICBjb25zb2xlLmVycm9yKG1hcEFyZyhlcnJvcikpO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QganNvbmlmeUVycm9yID0gcmVxdWlyZShcIi4vLi4vanNvbmlmeS1lcnJvclwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXBBcmcoYXJnKSB7XG4gICAgLy8gSW4gYnJvd3NlcnMsIHdlIGNvbnZlcnQgdGhlIGVycm9yIHRvIEpTT04gYnV0IG5vdCB0byBzdHJpbmcsIHNpbmNlIHRoZSBicm93c2VyJ3NcbiAgICAvLyBjb25zb2xlIGlzIGludGVyYWN0aXZlIGFuZCBhbGxvd3MgaW5zcGVjdGluZyB0aGUgcGxhaW4gb2JqZWN0IGVhc2lseS5cbiAgICByZXR1cm4gYXJnIGluc3RhbmNlb2YgRXJyb3IgPyBqc29uaWZ5RXJyb3IoYXJnKSA6IGFyZztcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0U3VwZXJjbGFzc2VzKG9iaikge1xuICAgIGNvbnN0IHN1cGVyY2xhc3NlcyA9IFtdO1xuICAgIGxldCB0ZW1wID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gICAgaWYgKHRlbXAgIT09IG51bGwpIHRlbXAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGVtcCk7XG4gICAgd2hpbGUgKHRlbXAgIT09IG51bGwpIHtcbiAgICAgICAgc3VwZXJjbGFzc2VzLnB1c2godGVtcC5jb25zdHJ1Y3Rvci5uYW1lKTtcbiAgICAgICAgdGVtcCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0ZW1wKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyY2xhc3Nlcztcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IGdldFN1cGVyY2xhc3NlcyA9IHJlcXVpcmUoXCIuL2dldC1zdXBlcmNsYXNzZXNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ganNvbmlmeUVycm9yKGVycm9yKSB7XG4gICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHJldHVybiBlcnJvcjtcbiAgICBjb25zdCB3cmFwcGVkRXJyb3IgPSB7fTtcbiAgICB3cmFwcGVkRXJyb3IubmFtZSA9IGVycm9yLm5hbWUgfHwgXCI8bm8gbmFtZSBhdmFpbGFibGU+XCI7XG4gICAgd3JhcHBlZEVycm9yLmNsYXNzTmFtZSA9IGVycm9yLmNvbnN0cnVjdG9yLm5hbWUgfHwgXCI8bm8gY2xhc3MgbmFtZSBhdmFpbGFibGU+XCI7XG4gICAgd3JhcHBlZEVycm9yLm1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlIHx8IFwiPG5vIG1lc3NhZ2UgYXZhaWxhYmxlPlwiO1xuICAgIHdyYXBwZWRFcnJvci5zdXBlcmNsYXNzZXMgPSBnZXRTdXBlcmNsYXNzZXMoZXJyb3IpO1xuICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzID0ge307XG4gICAgZm9yIChjb25zdCB4IGluIGVycm9yKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZXJyb3JbeF0gPT09IFwiZnVuY3Rpb25cIikgY29udGludWU7XG4gICAgICAgIHdyYXBwZWRFcnJvci5lbnVtZXJhYmxlRmllbGRzW3hdID0gZXJyb3JbeF07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZXJyb3Iuc3RhY2sgPT09IFwic3RyaW5nXCIgJiYgZXJyb3Iuc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykubWFwKHggPT4geC5yZXBsYWNlKC9eXFxzKy8sIFwiXCIpKS5maWx0ZXIoeCA9PiB4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3cmFwcGVkRXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjayB8fCBcIjxubyBzdGFjayB0cmFjZSBhdmFpbGFibGU+XCI7XG4gICAgfVxuICAgIHJldHVybiB3cmFwcGVkRXJyb3I7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBtYXBBcmcgPSByZXF1aXJlKFwiLi9tYXAtYXJnXCIpO1xuXG5jb25zdCBtZXRob2ROYW1lcyA9IFtcImxvZ1wiLCBcImRlYnVnXCIsIFwiaW5mb1wiLCBcIndhcm5cIiwgXCJlcnJvclwiXTtcblxubGV0IGFscmVhZHlPdmVycmlkZGVuID0gZmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb3ZlcnJpZGVDb25zb2xlKCkge1xuICAgIGlmIChhbHJlYWR5T3ZlcnJpZGRlbikgcmV0dXJuO1xuICAgIGFscmVhZHlPdmVycmlkZGVuID0gdHJ1ZTtcblxuICAgIGNvbnN0IG9yaWdpbmFsTWV0aG9kcyA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBtZXRob2ROYW1lIG9mIG1ldGhvZE5hbWVzKSB7XG4gICAgICAgIGlmICghY29uc29sZVttZXRob2ROYW1lXSkgY29udGludWU7XG4gICAgICAgIG9yaWdpbmFsTWV0aG9kc1ttZXRob2ROYW1lXSA9IGNvbnNvbGVbbWV0aG9kTmFtZV0uYmluZChjb25zb2xlKTtcbiAgICAgICAgY29uc29sZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsTWV0aG9kc1ttZXRob2ROYW1lXSguLi5hcmdzLm1hcChtYXBBcmcpKTtcbiAgICAgICAgfTtcbiAgICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9qc29uaWZ5LWVycm9yXCIpO1xuY29uc3QgdG9TdHJpbmcgPSByZXF1aXJlKFwiLi90by1zdHJpbmdcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyB0aGlzIEVycm9yIGluc3RhbmNlIHRvIGEgSlNPTiByZXByZXNlbnRhdGlvbi5cbiAgICAgKiBcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICovXG4gICAgRXJyb3IucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ganNvbmlmeUVycm9yKHRoaXMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyB0aGlzIEVycm9yIGluc3RhbmNlIHRvIHRoZSBmdWxsIHN0cmluZ2lmaWNhdGlvblxuICAgICAqIG9mIGl0cyBKU09OIHJlcHJlc2VudGF0aW9uLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYW1vdW50T2ZTcGFjZXM9NF0gVGhlIGFtb3VudCBvZiBzcGFjZXMgdG8gdXNlXG4gICAgICogZm9yIGluZGVudGF0aW9uIGluIHRoZSBvdXRwdXQgc3RyaW5nLlxuICAgICAqIFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbihhbW91bnRPZlNwYWNlcyA9IDQpIHtcbiAgICAgICAgcmV0dXJuIHRvU3RyaW5nKHRoaXMsIGFtb3VudE9mU3BhY2VzKTtcbiAgICB9O1xuXG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBqc29uaWZ5RXJyb3IgPSByZXF1aXJlKFwiLi9qc29uaWZ5LWVycm9yXCIpO1xuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBnaXZlbiBlcnJvciB0byBhIGJpZyBzdHJpbmcgcmVwcmVzZW50YXRpb24sIGNvbnRhaW5pbmdcbiAqIHRoZSB3aG9sZSBkYXRhIGZyb20gaXRzIEpTT04gcmVwcmVzZW50YXRpb24uXG4gKiBcbiAqIEBwYXJhbSB7ZXJyb3J9IGVycm9yIFRoZSBlcnJvciB0byBiZSBjb252ZXJ0ZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gW2Ftb3VudE9mU3BhY2VzPTRdIFRoZSBhbW91bnQgb2Ygc3BhY2VzIHRvIHVzZVxuICogZm9yIGluZGVudGF0aW9uIGluIHRoZSBvdXRwdXQgc3RyaW5nLlxuICogXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IElmIHRoZSBnaXZlbiBlcnJvciBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgRXJyb3JcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0b1N0cmluZyhlcnJvciwgYW1vdW50T2ZTcGFjZXMgPSA0KSB7XG4gICAgaWYgKCEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJqc29uaWZ5RXJyb3IudG9TdHJpbmcoKSBlcnJvcjogRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBpbnN0YW5jZSBvZiBFcnJvci5cIik7XG4gICAgY29uc3QgYXNKU09OID0ganNvbmlmeUVycm9yKGVycm9yKTtcbiAgICByZXR1cm4gYCR7YXNKU09OLmNsYXNzTmFtZX06ICR7YXNKU09OLm1lc3NhZ2V9ICR7SlNPTi5zdHJpbmdpZnkoYXNKU09OLCBudWxsLCBhbW91bnRPZlNwYWNlcyl9YDtcbn07Il19
