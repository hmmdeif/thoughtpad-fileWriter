thoughtpad-fileWriter
=====================

[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Small thoughtpad module for writing files to the filesystem

## Usage

This module has a few ease of use functions (ideally for use with thoughtpad and/or its modules):

`writeFile` will write contents to a file location. If the path does not exist and/or has missing folders somewhere in its path, then they will be created automatically.

Arguments:
* `file` - the filename
* `data` - the contents of the file to be written
* `splitPart` - optional argument defaulting to `out/`. This should be the split point at which a directory might not exist (i.e. the root directory)

`copyDirectory` will copy an entire directory to the end location.

Arguments:
* `startLocation` - the root directory where everything will be copied from
* `endLocation` - the requested end directory for all the files to end up
* `splitPart` - optional argument defaulting to `out/`. This should be the split point of the end location directory where it might not exist (i.e. the root directory)

`remakeDirectory` removes everything from the specified folder and makes the base directory again.

Arguments:
* `folder` - the folder to remake

## Tests

Ensure you have globally installed mocha - `npm -g install mocha`. Then you can run:

`mocha --harmony-generators`

Alternatively if you are in a *NIX environment `npm test` will run the tests plus coverage data.

## License

The code is available under the [MIT license](http://deif.mit-license.org/).

[travis-image]: https://img.shields.io/travis/hmmdeif/thoughtpad-fileWriter/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/hmmdeif/thoughtpad-fileWriter
[coveralls-image]: https://img.shields.io/coveralls/hmmdeif/thoughtpad-fileWriter/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/hmmdeif/thoughtpad-fileWriter?branch=master