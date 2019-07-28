jsonify-error
=============

[![npm package](https://nodei.co/npm/jsonify-error.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/jsonify-error/)

[![NPM version][npm-version-badge]][npm-url]
[![Build status][build-status-badge]][travis-url]
[![Minzipped size][minzipped-size-badge]][bundlephobia-url]
[![License][license-badge]][license-url]
[![NPM downloads][npm-downloads-badge]][npm-url]
[![Dependency Status][dependency-status-badge]](https://david-dm.org/papb/jsonify-error)
[![Dev Dependency Status][dev-dependency-status-badge]](https://david-dm.org/papb/jsonify-error)
[![Open Issues][open-issues-badge]](https://github.com/papb/jsonify-error/issues)
[![Closed Issues][closed-issues-badge]](https://github.com/papb/jsonify-error/issues?q=is%3Aissue+is%3Aclosed)
[![contributions welcome][contrib-welcome-badge]](https://github.com/papb/jsonify-error/issues)
[![jsDelivr hits][jsdelivr-badge]](https://www.jsdelivr.com/package/npm/jsonify-error)

Convert errors to JSON or to a good string. Develop faster with better error messages.

It's 2019 and still the default behavior of JavaScript could be better with regard to displaying/manipulating errors:

* `JSON.stringify(e)`: Bad
* `e.toString()`: Bad
* `e.toJSON()`: Doesn't exist
* `console.log(e)`: Bad in browsers, not so bad in Node but could be better

But **jsonify-error** comes to the rescue:

* For `JSON.stringify(e)`:
    * Use `JSON.stringify(jsonifyError(e))` instead
    * Or call `jsonifyError.overrideErrorMethods()` once and then `JSON.stringify(e)` will work.
* For `e.toString()`:
    * Use `jsonifyError.asString(e)` instead
    * Or call `jsonifyError.overrideErrorMethods()` once and then `e.toString()` will work.
* For `e.toJSON()`:
    * Use `jsonifyError(e)` instead
    * Or call `jsonifyError.overrideErrorMethods()` once and then `e.toJSON()` will work.
* For `console.log(e)`:
    * Use `jsonifyError.log(e)` instead
    * Or call `jsonifyError.overrideConsole()` once and then `console.log(e)` will work.

# Installation

## In Browsers

For browsers, simply include one of the dists in your entry point, such as `dist/jsonify-error.js`. The dists are available in [jsDelivr](https://cdn.jsdelivr.net/npm/jsonify-error/):

```html
<script src="https://cdn.jsdelivr.net/npm/jsonify-error@2.0.0/dist/jsonify-error.min.js" integrity="sha384-k3Is8aV5PW6XO2NtZyFbjgZLKNWv4kFrtuN0cnOhaw+qKurzZIlOZZNmih+HGKpN" crossorigin="anonymous"></script>
```

The following dists are available (with source maps):

* `dist/jsonify-error.js`
* `dist/jsonify-error.min.js`
* `dist/jsonify-error.es5.js`
* `dist/jsonify-error.es5.min.js`

Or if you're developing a browser library with Browserify, you can just require it normally, as if you were in a Node environment.

## In Node

In node, as usual, simply do:

```
npm install --save jsonify-error
```

# Purpose

The main purpose of **jsonify-error**, as the name suggests, is to convert an error to a plain object. Just do `jsonifyError(e)` and you will get something like:

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

If you're thinking *"Great! Now I can do `console.log(jsonifyError(e))` instead of `console.log(e)`" in a browser*, you're in the right track, but you can do even better!
A few utility methods are exposed by **jsonifyError** beyond the main one, as mentioned in the beginning of this README. 

* `jsonifyError.log(e)`: Logs the error in a much better way than `console.log(e)`.
* `jsonifyError.overrideConsole()`: Makes `console.log`, `console.warn`, `console.error` work like `jsonifyError.log` automatically. Calling this once is enough.
* `jsonifyError.overrideErrorMethods()`: Heavily improves `e.toString()` and adds `e.toJSON()` to all errors automatically. Calling this once is enough.

## Example: with try-catch blocks

```javascript
const jsonifyError = require("jsonify-error");

try {
    // ...
} catch (e) {
    jsonifyError.log(e);
    // ...
}
```

## Example: with promises

```javascript
const jsonifyError = require("jsonify-error");

somethingAsync().then(() => {
    // ...
}).catch(error => {
    jsonifyError.log(e);
    // ...
});
```

Also, for promises, there is a sibling module called **[better-promise-error-log]** which takes care of showing the improved logs automatically for unhandled rejections.

## Example: with express

```javascript
var jsonifyError = require("jsonify-error");

app.get('/your/api', (req, res) => {
    // ...
    // Instead of res.status(500).json(error), do:
    res.status(500).json(jsonifyError(error));
});
```

Note: if you've overriden error methods (by calling `jsonifyError.overrideErrorMethods()`), the above can be simplified to `res.status(500).json(error)` (see the *overriding methods* section).

## Example usage: overriding methods

```javascript
const jsonifyError = require("jsonify-error");
jsonifyError.overrideConsole();
jsonifyError.overrideErrorMethods();
// Now `console.log`, `console.warn` and `console.error` will be much better.
// Also, `e.toString()` will be much better and `e.toJSON()` will be available.
```

# Contributing

Any contribution is very welcome. Feel free to open an issue about anything: questions, suggestions, feature requests, bugs, improvements, mistakes, whatever. I will be always looking.

# Changelog

The changelog is available in [CHANGELOG.md](CHANGELOG.md).

# See also

* [better-promise-error-log]

# License

MIT (c) Pedro Augusto de Paula Barbosa

[npm-url]: https://npmjs.org/package/jsonify-error
[npm-version-badge]: https://badgen.net/npm/v/jsonify-error
[build-status-badge]: https://badgen.net/travis/papb/jsonify-error
[minzipped-size-badge]: https://badgen.net/bundlephobia/minzip/jsonify-error
[dependency-status-badge]: https://badgen.net/david/dep/papb/jsonify-error
[dev-dependency-status-badge]: https://badgen.net/david/dev/papb/jsonify-error
[npm-downloads-badge]: https://badgen.net/npm/dt/jsonify-error
[open-issues-badge]: https://badgen.net/github/open-issues/papb/jsonify-error
[closed-issues-badge]: https://badgen.net/github/closed-issues/papb/jsonify-error
[contrib-welcome-badge]: https://badgen.net/badge/contributions/welcome/green
[license-badge]: https://badgen.net/npm/license/jsonify-error
[jsdelivr-badge]: https://data.jsdelivr.com/v1/package/npm/jsonify-error/badge?style=rounded

[license-url]: LICENSE
[travis-url]: https://travis-ci.com/papb/jsonify-error
[bundlephobia-url]: https://bundlephobia.com/result?p=jsonify-error
[better-promise-error-log]: https://npmjs.org/package/better-promise-error-log