"use strict";

function stripColorsIfString(arg) {
    if (typeof arg !=="string") return arg;
    /* eslint-disable-next-line no-control-regex */
    return arg.replace(/\u001b\[\d{1,2}m/g, "").replace(/\\u001b\[\d{1,2}m/g, "");
}

module.exports = stripColorsIfString;