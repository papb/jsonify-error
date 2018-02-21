jsonify-error
=============

[![npm package](https://nodei.co/npm/jsonify-error.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/jsonify-error/)

[![NPM version][npm-version-image]][npm-url]
[![Dependency Status](https://david-dm.org/papb/jsonify-error.svg)](https://david-dm.org/papb/jsonify-error)
[![MIT License][license-image]][license-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/papb/jsonify-error/issues)

It's 2018 and neither `JSON.stringify(x)` nor `console.log(x)` behave as nicely as they could when `x` is an error.

With **jsonify-error**, use `jsonifyError(x)` instead of `x`. It produces a plain object with everything one could wish to see about an error.

# Installation

For browsers, simply include browser.js in your entry point:

```html
<script src="https://rawgit.com/papb/jsonify-error/1.0.0/browser.js"></script>
```

In node, simply `npm install --save jsonify-error`.

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

For better error logs of unhandled errors in promises, the recommended solution is to **use the sibling module, [better-promise-error-log](better-promise-error-log)**. But if you insist, you can do:

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

# Contributing

Any contribution is very welcome. Feel free to open an issue about anything: questions, suggestions, feature requests, bugs, improvements, mistakes, whatever. I will be always looking.

# License

MIT

[npm-url]: https://npmjs.org/package/jsonify-error
[npm-version-image]: https://img.shields.io/npm/v/jsonify-error.svg
[npm-downloads-image]: https://img.shields.io/npm/dt/jsonify-error.svg

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE

[better-promise-error-log]: https://npmjs.org/package/better-promise-error-log