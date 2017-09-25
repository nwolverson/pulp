"use strict";

var path = require('path');

exports.sorceryImpl = function sorceryImpl(sourcemaps, file, succ, err) {
  var logErr = function (e) {
    console.error(e);
    err();
  };
  // Sorcery wants source map objects, not text
  var maps = {};
  Object.keys(sourcemaps).forEach(function (k) {
    maps[k] = JSON.parse(sourcemaps[k].map);
    maps[k].sources = maps[k].sources.map(function (f) {
      return path.resolve(sourcemaps[k].baseDir, f);
    });
  });
  var sorcery = require('sorcery');
  sorcery.load(file, {
    sourcemaps: maps
  }).then(function (chain) {
    if (!chain) {
      err(new Error("Sorcery did not resolve chain for " + file));
      return;
    }
    chain.write().then(succ, logErr);
  }, logErr);
};
