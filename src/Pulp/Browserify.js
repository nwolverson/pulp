// module Pulp.Browserify

"use strict";

function write(input, output, callback) {
  var pipe = require("through")();
  input.pipe(pipe);
  pipe.pipe(output, {end: false});
  pipe.on("end", callback);
}

exports["browserifyBundle'"] = function browserifyBundle$prime(opts, callback) {
  var StringStream = require("string-stream");
  var browserify = require("browserify");
  var mold = require("mold-source-map");
  var b = browserify({
    basedir: opts.basedir,
    entries: new StringStream(opts.src),
    standalone: opts.standalone,
    debug: opts.debug
  });
  if (opts.transform) {
    b.transform(opts.transform);
  }
  var bundle = b.bundle();
  if (opts.debug) {
    bundle = bundle
      // .pipe(mold.transformSourcesRelativeTo(opts.outDir))
      .pipe(mold.transform(function (map) {
        map.sourceRoot(require('path').dirname(opts.tmpFilePath));
        return "// hello!!!\n\n" + map.toComment();
      }));
  }
  write(bundle, opts.out, callback);
};

exports["browserifyIncBundle'"] = function browserifyIncBundle$prime(opts, callback) {
  var browserifyInc = require("browserify-incremental");
  var mold = require("mold-source-map");
  var b = browserifyInc({
    basedir: opts.buildPath,
    cacheFile: opts.cachePath,
    standalone: opts.standalone,
    debug: opts.debug
  });
  b.add(opts.path);
  if (opts.transform) b.transform(opts.transform);
  var bundle = b.bundle();
  if (opts.debug) {
    bundle = bundle.pipe(mold.transformSourcesRelativeTo(opts.outDir));
  }
  write(bundle, opts.out, callback);
};
