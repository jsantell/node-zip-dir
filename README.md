# zip-dir

Zips up a directory and saves the zip to disk or returns as a buffer.

## example

```
var zipdir = require('zip-dir');

zipdir('/path/to/be/zipped', function (err, buffer) {
  // `buffer` is the buffer of the zipped file
});

zipdir('/path/to/be/zipped', '~/myzip.zip', function (err, buffer) {
  // `buffer` is the buffer of the zipped file
  // And the buffer was saved to `~/myzip.zip`
});
```

## methods

```
var zipdir = require('zip-dir');
```

### zipdir(dirPath, [savePath], callback)

Zips up `dirPath` recursively preserving directory structure and returns
the compressed buffer into `callback` on success. If `savePath` defined, the
buffer will also be saved to disk at that path, with the callback also firing
upon completion with the buffer.

## install

```
$ npm install zip-dir
```

## license

MIT

