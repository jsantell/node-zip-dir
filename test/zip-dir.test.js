var Zip = require('jszip');
var unzip = require('unzip');
var zipDir = require('../index');
var path = require('path');
var fs = require('fs-extra');
var bufferEqual = require('buffer-equal');
var chai = require('chai');
var expect = chai.expect;

var sampleZipPath = path.join(__dirname, 'fixtures/sampleZip');
var xpiPath = path.join(__dirname, 'my.xpi');
var outputPath = path.join(__dirname, 'myxpi/');

describe('zip-dir', function () {
  describe('creates a zip buffer', function () {
    it('returns a usable zip buffer', function (done) {
      zipDir(sampleZipPath, function (err, buffer) {
        expect(err).to.not.be.ok;
        var zip = new Zip();
        zip.load(buffer);
        done();
      });
    });

    it('returns an error when dirPath doesn\'t exist', function (done) {
      zipDir(xpiPath, function (err, buffer) {
        expect(err).to.be.ok;
        expect(buffer).to.not.be.ok;
        done();
      });
    });

    it('returns an error when dirPath is a file', function (done) {
      zipDir(path.join(sampleZipPath, 'file1.json'), function (err, buffer) {
        expect(err).to.be.ok;
        expect(buffer).to.not.be.ok;
        done();
      });
    });
  });

  describe('writes a zip file', function () {
    beforeEach(zipAndUnzip);
    afterEach(cleanUp);
    it('compresses and unpacks and all files match', function (done) {
      var files = [
        'file1.json',
        'tiny.gif',
        'dir/file2.json',
        'dir/file3.json',
        'dir/deepDir/deeperDir/file4.json'
      ];
      files.forEach(compareFiles);
      done();
    });
  });
});

function compareFiles (file) {
  var zipBuffer = fs.readFileSync(path.join(sampleZipPath, file));
  var fileBuffer = fs.readFileSync(path.join(outputPath, file));
  expect(bufferEqual(zipBuffer, fileBuffer)).to.be.ok;
}

function zipAndUnzip (done) {
  zipDir(sampleZipPath, xpiPath, function (err, buffer) {
    if (err) throw err;
    fs.createReadStream(xpiPath)
      .pipe(unzip.Extract({ path: outputPath }))
      .on('close', done);
  });
}

function cleanUp (done) {
  fs.remove(outputPath, function () {
    fs.remove(xpiPath, done);
  });
}
