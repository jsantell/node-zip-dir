var fs = require('fs');
var path = require('path');
// Use local version of JSZip, as the version in `npm` is a fork
// and not up to date, and failing on v0.8, so this is an unfortunate
// work around
// from: https://github.com/Stuk/jszip
var Zip = require('jszip');

module.exports = function zipWrite (rootDir, options, callback) {
  if (!callback) {
    callback = options;
    options = {};
  }

  options = options || {};

  zipBuffer(rootDir, options, function (err, buffer) {
    if (options.saveTo) {
      fs.writeFile(options.saveTo, buffer, { encoding: 'binary' }, function (err) {
        callback(err, buffer);
      });
    } else {
      callback(err, buffer);
    }
  });
};

function zipBuffer (rootDir, options, callback) {
  var zip = new Zip();
  var folders = {};
  // Resolve the path so we can remove trailing slash if provided
  rootDir = path.resolve(rootDir);

  folders[rootDir] = zip;

  dive(rootDir, function (err) {
    if (err) return callback(err);

    callback(null, zip.generate({
      compression: 'DEFLATE',
      type: 'nodebuffer'
    }));
  });

  function dive (dir, callback) {
    fs.readdir(dir, function (err, files) {
      if (err) return callback(err);
      if (!files.length) return callback();
      var count = files.length;
      files.forEach(function (file) {
        var fullPath = path.resolve(dir, file);
        addItem(fullPath, function (err) {
          if (!--count) {
            callback(err);
          }
        });
      });
    });
  }

  function addItem (fullPath, cb) {
    fs.stat(fullPath, function (err, stat) {
      if (err) return cb(err);
      if (options.filter && !options.filter(fullPath, stat)) return cb();
      var dir = path.dirname(fullPath);
      var file = path.basename(fullPath);
      var parentZip;
      if (stat.isDirectory()) {
        parentZip = folders[dir];
        if (options.each) {
          options.each(fullPath);
        }
        folders[fullPath] = parentZip.folder(file);
        dive(fullPath, cb);
      } else {
        fs.readFile(fullPath, function (err, data) {
          if (options.each) {
            options.each(path.join(dir, file));
          }
          folders[dir].file(file, data);
          cb(err);
        });
      }
    });
  }
}
