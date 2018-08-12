jsonify-error
=============

[![npm package](https://nodei.co/npm/jsonify-error.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/jsonify-error/)

[![NPM version][npm-version-badge]][npm-url]
[![License][license-badge]][license-url]
[![NPM downloads][npm-downloads-badge]][npm-url]
[![Dependency Status][dependency-status-badge]](https://david-dm.org/papb/jsonify-error)
[![Dev Dependency Status][dev-dependency-status-badge]](https://david-dm.org/papb/jsonify-error)
[![contributions welcome][contrib-welcome-badge]](https://github.com/papb/jsonify-error/issues)
[![jsDelivr hits][jsdelivr-badge]](https://www.jsdelivr.com/package/npm/jsonify-error)

It's 2018 and neither `JSON.stringify(e)` nor `console.log(e)` behave as nicely as they could when `e` is an error.

With **jsonify-error**, use `jsonifyError(e)` instead of `e`. It produces a plain object with everything one could wish to see about an error.

# Installation

## In Browsers

For browsers, simply include one of the dists in your entry point, such as `dist/jsonify-error.js`. The dists are available in [jsDelivr](https://cdn.jsdelivr.net/npm/jsonify-error/):

```html
<script src="https://cdn.jsdelivr.net/npm/jsonify-error@1.2.1/dist/jsonify-error.js" integrity="sha384-k2RD7Ck9pL0UdHYGtnrPC014SjdObcGt9D5LP/CAqFdwee9qcTYt0BzTCiI8PGFn" crossorigin="anonymous"></script>
```

The following dists are available (with source maps):

* `dist/jsonify-error.js`
* `dist/jsonify-error.min.js`
* `dist/jsonify-error.es5.js`
* `dist/jsonify-error.es5.min.js`

## In Node

In node, as usual, simply do:

```
npm install --save jsonify-error
```

# Example result

The resulting plain object has the form:

```javascript
{
    "name": "TypeError",
    "className": "TypeError",
    "message": "It can't be a string",
    "superclasses": ["Error", "Object"],
    "enumerableFields": {
        // If the error has other fields they appear here (including in the prototype chain):
        "someField": "someValue"
    },
    "stack": [
        "TypeError: It can't be a string", 
        "at z (E:\\test.js:15:15)", 
        "at E:\\test.js:10:9", 
        "at Array.forEach (native)", 
        "at y (E:\\test.js:9:13)", 
        "at x (E:\\test.js:5:5)", 
        "at w (E:\\test.js:24:9)", 
        "at Object.<anonymous> (E:\\test.js:32:1)", 
        "at Module._compile (module.js:570:32)", 
        "at Object.Module._extensions..js (module.js:579:10)", 
        "at Module.load (module.js:487:32)"
    ]
}
```

# Example usage: try-catch

```javascript
var jsonifyError = require("jsonify-error");

try {
    // ...
} catch (e) {
    console.error(jsonifyError(e));
    process.exit(1);
}
```

# Example usage: promises

For better error logs of unhandled errors in promises, the recommended solution is to **use the sibling module, [better-promise-error-log][better-promise-error-log]**. But if you insist, you can do:

```javascript
var jsonifyError = require("jsonify-error");

somethingAsync().then(() => {
    // ...
}).catch(error => {
    console.error(jsonifyError(e));
    // process.exit(1); // Exiting or not depends on your situation
});
```

# Example usage: with express

```javascript
var jsonifyError = require("jsonify-error");

app.get('/your/api', (req, res) => {
    // ...
    // Instead of res.status(500).json(error), do:
    res.status(500).json(jsonifyError(error));
});
```

# Example usage: overriding console

```javascript
require("jsonify-error").overrideConsole();
// Now console.log, console.warn and console.error automatically
// call jsonifyError() on each argument that is instanceof Error
// before logging. Note that overriding native functions/objects
// is usually not a good practice so use this with caution.
```

*Note:* since 1.2.0, you can simply `console.log(jsonifyError(anything))` if you prefer, because if `anything` is not an error, `jsonifyError` will not touch it at all.

# Contributing

Any contribution is very welcome. Feel free to open an issue about anything: questions, suggestions, feature requests, bugs, improvements, mistakes, whatever. I will be always looking.

# License

MIT (c) Pedro Augusto de Paula Barbosa

[npm-url]: https://npmjs.org/package/jsonify-error
[npm-version-badge]: https://badgen.net/npm/v/jsonify-error
[dependency-status-badge]: https://badgen.net/david/dep/papb/jsonify-error
[dev-dependency-status-badge]: https://badgen.net/david/dev/papb/jsonify-error
[npm-downloads-badge]: https://badgen.net/npm/dt/jsonify-error
[contrib-welcome-badge]: https://badgen.net/badge/contributions/welcome/green
[license-badge]: https://badgen.net/npm/license/jsonify-error
[jsdelivr-badge]: https://data.jsdelivr.com/v1/package/npm/jsonify-error/badge?style=rounded

[license-url]: LICENSE
[better-promise-error-log]: https://npmjs.org/package/better-promise-error-log