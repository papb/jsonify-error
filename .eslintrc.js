module.exports = exports = {
    "env": {
        "es6": true,
        "node": true
    },

    "extends": "eslint:recommended",

    "globals": {
        "window": true
    },

    "rules": {
        "no-console": "off",
        "no-unused-vars": "off",
        "eqeqeq": ["error", "always"],
        "no-invalid-this": "error",
        "no-loop-func": "error",
        "no-return-assign": "error",
        "no-throw-literal": "error",
        "no-unused-expressions": "error",
        "no-warning-comments": [ "warn", {
            "terms": [ "TODO", "FIXME" ],
            "location": "start"
        }],
        "wrap-iife": ["error", "inside", { "functionPrototypeMethods": true }],
        "yoda": ["error", "never", { "exceptRange": true }],
        "strict": ["error", "global"]
    }
};