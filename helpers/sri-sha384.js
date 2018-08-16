"use strict";

// This script is used to obtain the sha-384 values
// for the Sub-resource Integrity (SRI) hash provided
// in README.md for the dist files.

const jetpack = require("fs-jetpack");
const sha384 = x => require("sha.js")("sha384").update(x).digest("base64");

jetpack.find("dist", { matching: "*.js" }).forEach(file => {
    const hash = sha384(jetpack.read(file));
    const filename = jetpack.inspect(file).name;
    console.log(`sha384(${filename}): ${hash}`);
});