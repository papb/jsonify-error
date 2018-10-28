"use strict";

if (!process.env.NODE_ENV) process.env.NODE_ENV = "test";

module.exports = function(config) {
    config.set({
        basePath: "",
        frameworks: ["mocha", "chai", "browserify"],
        files: [
            "node_modules/babel-polyfill/dist/polyfill.js",
            "lib/**/*.js",
            "browser-entrypoint.js",
            "test/browser/**/*.js"
        ],
        exclude: [
            "lib/**/log.js",
        ],
        preprocessors: {
            "lib/**/*.js": [ "browserify" ],
            "browser-entrypoint.js": [ "browserify" ],
            "test/browser/**/*.js": [ "browserify" ]
        },
        browserify: {
            configure: function(bundle) {
                bundle.transform(require("browserify-istanbul")({
                    ignore: ["test/**/*.js"]
                }));
            }
        },
        reporters: ["progress", "coverage"],
        coverageReporter: {
            dir: "coverage/",
            reporters: [
                { type: "text-summary" },
                { type: "html" }
            ]
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ["ChromeHeadless"],
        singleRun: true,
        concurrency: Infinity
    });
};