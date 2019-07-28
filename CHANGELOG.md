# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [2.0.0] - 2019-07-27
### Changed
- Strip color control characters from strings ([#8](https://github.com/papb/jsonify-error/issues/8))

    _**Note:** This was marked as a breaking change just to be safe. Someone might be doing tests comparing the output of jsonifyError directly, and something could break. But I guess 99.999% of the users can just upgrade._

## [1.4.5] - 2019-04-28
### Fixed
- Handle circular references gracefully instead of crashing ([#7](https://github.com/papb/jsonify-error/pull/7)) (Thanks @agentofuser)
### Changed
- Use LF instead of CRLF

## [1.4.4] - 2019-02-11
### Changed
- Improved README

## [1.4.3] - 2019-01-13
### Added
- Added another test
### Fixed
- Fixed typo in readme

## [1.4.2] - 2018-11-12
### Fixed
- No longer stringify on browsers, letting the object be logged directly instead.
- Remove empty stack entries
- Fixed typo in changelog

## [1.4.1] - 2018-10-27
### Added
- `jsonifyError.asString(error)` function
### Changed
- Fixed browser CDN URL in README

## [1.4.0] - 2018-10-27
### Added
- `jsonifyError.log(error)` function
- `jsonifyError.overrideErrorMethods()` function (enabling powerful `.toJSON()` and `.toString()` methods on errors)
- Dev: added node and browser tests (with Travis CI!)
### Changed
- Improved README
- Dev: separate the library in multiple files

## [1.3.1] - 2018-08-15
### Changed
- Dev: fix dist line endings for SRI calculations ([#6](https://github.com/papb/jsonify-error/issues/6))

## [1.3.0] - 2018-08-15
### Added
- Fixed wrong SRI hash in README.md (again, sorry!)
- Dev: added script to calculate SRI hash correctly

### Changed
- Removed the `browser` field in `package.json` altogether ([#5](https://github.com/papb/jsonify-error/issues/5))

## [1.2.2] - 2018-08-13
### Changed
- The `browser` field in `package.json` no longer points to a browserified bundle ([#4](https://github.com/papb/jsonify-error/issues/4))
- Fixed wrong SRI hash in README

## [1.2.1] - 2018-08-11
### Changed
- `jsDelivr` is now suggested in readme instead of `rawgit`
- Fixed issue links in changelog
- (nothing changed in the code itself)

## [1.2.0] - 2018-08-11
### Added
- Source maps for all dists ([#2](https://github.com/papb/jsonify-error/issues/2))
- Property `.className` in the json output (from `error.constructor.name`)
- Dists are included in npm distribution now (with a `"browser"` entry on `package.json`)

### Changed
- Improved `<no stack trace available>` output ([#3](https://github.com/papb/jsonify-error/issues/3))
- It is now transparent to non-errors ([#1](https://github.com/papb/jsonify-error/issues/1))

## [1.1.2] - 2018-08-04
### Added
- Multiple dists available for browsers (es6, es5, and minified).
- dev: reorganized dependencies & scripts in package.json

## [1.1.1] - 2018-02-21
### Added
- Handle situations when `name`, `message` or `stack` are missing.

Note: 1.1.0 was skipped because of a mistake.

## 1.0.0 - 2018-02-21

- Initial version.

[Unreleased]: https://github.com/papb/jsonify-error/compare/2.0.0...HEAD
[2.0.0]: https://github.com/papb/jsonify-error/compare/1.4.5...2.0.0
[1.4.5]: https://github.com/papb/jsonify-error/compare/1.4.4...1.4.5
[1.4.4]: https://github.com/papb/jsonify-error/compare/1.4.3...1.4.4
[1.4.3]: https://github.com/papb/jsonify-error/compare/1.4.2...1.4.3
[1.4.2]: https://github.com/papb/jsonify-error/compare/1.4.1...1.4.2
[1.4.1]: https://github.com/papb/jsonify-error/compare/1.4.0...1.4.1
[1.4.0]: https://github.com/papb/jsonify-error/compare/1.3.1...1.4.0
[1.3.1]: https://github.com/papb/jsonify-error/compare/1.3.0...1.3.1
[1.3.0]: https://github.com/papb/jsonify-error/compare/1.2.2...1.3.0
[1.2.2]: https://github.com/papb/jsonify-error/compare/1.2.1...1.2.2
[1.2.1]: https://github.com/papb/jsonify-error/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/papb/jsonify-error/compare/1.1.2...1.2.0
[1.1.2]: https://github.com/papb/jsonify-error/compare/1.1.1...1.1.2
[1.1.1]: https://github.com/papb/jsonify-error/compare/1.0.0...1.1.1