var Zip = require('jszip');
var fs = require('fs');
var path = require('path');

module.exports = function zipWrite (rootDir, saveTo, callback) {
  if (!callback) {
    callback = saveTo;
    saveTo = null;
  }

  zipBuffer(rootDir, function (err, buffer) {
    if (saveTo) {
      fs.writeFile(saveTo, buffer, { encoding: 'binary' }, function (err) {
        callback(err, buffer);
      });
    } else {
      callback(err, buffer);
    }
  });
};

function zipBuffer (rootDir, callback) {
  var zip = new Zip();
  var folders = {};
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
      var dir = path.dirname(fullPath);
      var file = path.basename(fullPath);
      var parentZip;
      if (stat.isDirectory()) {
        parentZip = folders[dir];
        folders[fullPath] = parentZip.folder(file);
        dive(fullPath, cb);
      } else {
        fs.readFile(fullPath, function (err, data) {
          folders[dir].file(file, data);
          cb(err);
        });
      }
    });
  }
}
