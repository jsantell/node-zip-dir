# zip-dir

Zips up a directory and saves the zip to disk or returns as a buffer.

[![Build Status](https://travis-ci.org/jsantell/node-zip-dir.png)](https://travis-ci.org/jsantell/node-zip-dir)

## example

```
var zipdir = require('zip-dir');

zipdir('/path/to/be/zipped', function (err, buffer) {
  // `buffer` is the buffer of the zipped file
});

zipdir('/path/to/be/zipped', { saveTo: '~/myzip.zip' }, function (err, buffer) {
  // `buffer` is the buffer of the zipped file
  // And the buffer was saved to `~/myzip.zip`
});
```

## methods

```
var zipdir = require('zip-dir');
```

### zipdir(dirPath, [options], callback)

Zips up `dirPath` recursively preserving directory structure and returns
the compressed buffer into `callback` on success. If `savePath` defined, the
buffer will also be saved to disk at that path, with the callback also firing
upon completion with the buffer.

#### Options

* `saveTo` A path to save the buffer to.
* `filter` A function that is called for all items to determine whether or not they should be added to the zip buffer. Function is called with the `fullPath` and a `stats` object ([fs.Stats](http://nodejs.org/api/fs.html#fs_class_fs_stats)). Return true to add the item; false otherwise. To include files within directories, directories must also pass this filter.

## install

```
$ npm install zip-dir
```

## license

MIT
