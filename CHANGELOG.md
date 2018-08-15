# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

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

[Unreleased]: https://github.com/papb/jsonify-error/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/papb/jsonify-error/compare/v1.2.2...v1.3.0
[1.2.2]: https://github.com/papb/jsonify-error/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/papb/jsonify-error/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/papb/jsonify-error/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/papb/jsonify-error/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/papb/jsonify-error/compare/v1.0.0...v1.1.1