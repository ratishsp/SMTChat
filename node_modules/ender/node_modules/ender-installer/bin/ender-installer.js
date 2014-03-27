#!/usr/bin/env node

var enderInstaller  = require('../')
  , argsParser      = require('ender-args-parser')
  , DependencyGraph = require('ender-dependency-graph')
  , options         = argsParser.parseClean(['build'].concat(process.argv.slice(2)))

if (!options.packages.length) {
  console.error('Usage: ender-installer <package1>[ <package2>[ <package3> ]]')
  return process.exit(-1)
}

enderInstaller(options, options.packages, function (err, results, dependencyGraph) {
  if (err) throw err

  console.log(DependencyGraph.archyTree(options.packages, dependencyGraph, true))
})