"use strict";

// This script is used to ensure LF in all dist files.

const jetpack = require("fs-jetpack");

jetpack.list("dist").forEach(file => {
    const content = jetpack.read("dist/" + file).replace(/\r?\n/g, "\n");
    jetpack.write("dist/" + file, content);
});