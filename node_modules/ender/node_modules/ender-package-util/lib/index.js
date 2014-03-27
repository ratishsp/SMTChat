/*!
 * ENDER - The open module JavaScript framework
 *
 * Copyright (c) 2011-2012 @ded, @fat, @rvagg and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const fs                = require('fs')
    , path              = require('path')
    , mkdirp            = require('mkdirp')
    , extend            = require('util')._extend
    , FilesystemError   = require('errno').custom.FilesystemError
    , PackageDescriptor = require('./descriptor')
    , JSONParseError    = require('./errors').JSONParseError

    , stripVersionRegex = /@.*$/

// strip out the version if it exists, bean@0.4.5 -> bean
var cleanName = function (name) {
      if (Array.isArray(name)) {
        return name.map(function (n) {
          return cleanName(n)
        })
      } else {
        return name.replace(stripVersionRegex, '')
      }
    }

/*
  , isCWD = function (pkg) {
      return path.resolve(pkg) == path.resolve('.')
    }
*/

  , isPath = function (pkg) {
      return (pkg = cleanName(pkg)) === '.' || /[\/\\]/.test(pkg)
    }

    // given an array of parent packages and a package name, give us a path to the
    // package inside the CWD node_modules directory
  , getPackageRoot = function (parents, pkg) {
      var dirs = [ 'node_modules' ]

      pkg = cleanName(pkg)

      if (!isPath(pkg)) { // not a directory reference of some kind
        parents.forEach(function (p) {
          if (p == '.') return
          dirs.push(p)
          dirs.push(dirs[0])
        })
        return path.resolve(path.join.apply(null, dirs), pkg)
      }

      return path.resolve(pkg)
    }

    // perhaps this could be done with `require()` since it can now read package.json?
  , readPackageJSON = function (parents, pkg, callback) {
      var root = getPackageRoot(parents, pkg)
        , file = path.resolve(root, 'package.json')

      fs.readFile(file, 'utf-8', function (err, data) {
        if (err) return callback(new FilesystemError(err))
        try {
          data = JSON.parse(data)
        } catch (err) {
          return callback(new JSONParseError(err.message + ' [' + file + ']', err))
        }
        callback(null, PackageDescriptor.create(data))
      })
    }

/*
This appears to be unused, should be removed if nothing breaks!

    // if one of the packages is a path that points to the CWD then get the
    // name of it
  , findRootPackageName = function (packages, callback) {
      var found = function (err, data) {
          if (err) return callback(err) // wrapped by readPackageJSON
          callback(null, data.name)
        }

      for (var i = 0; i < packages.length; i++) {
        if (isCWD(packages[i])) return readPackageJSON([], packages[i], found)
      }

      callback()
    }
*/

  , getDependenciesFromJSON = function (packageJSON) {
      var dep = packageJSON.dependencies
      if (dep && !Array.isArray(dep)) dep = Object.keys(dep)
      return dep && dep.length ? dep : []
    }

  , getDependenciesFromDirectory = function (parents, pkg, callback) {
      var root = getPackageRoot(parents, pkg)
        , dir = path.resolve(path.join(root, 'node_modules'))

      fs.exists(dir, function (exists) {
        if (!exists) return callback(null, [])
        fs.readdir(dir, function (err, files) {
          if (err) return callback(new FilesystemError(err))
          files = files.filter(function(file) {
            return file !== '.bin'
          });
          callback.call(null, err, files)
        })
      })
    }

  , preparePackagesDirectory = function (callback) {
      mkdirp('node_modules', function (err) {
        if (err) return callback(new FilesystemError(err))
        callback()
      })
    }

module.exports = {
    cleanName                    : cleanName
  , isPath                       : isPath
  , getPackageRoot               : getPackageRoot
  , readPackageJSON              : readPackageJSON
  , getDependenciesFromJSON      : getDependenciesFromJSON
  , preparePackagesDirectory     : preparePackagesDirectory
  , getDependenciesFromDirectory : getDependenciesFromDirectory
}

extend(module.exports, require('./errors'))