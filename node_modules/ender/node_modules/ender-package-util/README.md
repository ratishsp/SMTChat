# Ender Package Util [![Build Status](https://secure.travis-ci.org/ender-js/ender-package-util.png)](http://travis-ci.org/ender-js/ender-package-util)

A component of the [Ender CLI](https://github.com/ender-js/Ender/), providing utilities for working with npm packages, including Ender-specific package.json files.

This package is used by the [ender-repository](https://github.com/ender-js/ender-repository) to provide an interface to npm for the Ender CLI.

## About Ender

For more information check out [http://ender.jit.su](http://ender.jit.su)

## API

### cleanName(name | names)
`cleanName()` will provide a plain package name given a package name with version and/or tag. So `'bean@0.4.5'` becomes `'bean'`. Can also operate on an array of names and will return an array of cleaned names.

-------------------------

### isPath(package)
`isPath()` returns a boolean when given a package name or path to a package to indicate whether this package is a path or a package in the repository.

```js
isPath('bean')         // → false
isPath('bean@0.5.0')   // → false
isPath('/path/to/pkg') // → true
isPath('../foo')       // → true
```

-------------------------

### getPackageRoot(parents, package)
`getPackageRoot()` will return an absolute path to the *installed* 'package' given an array of its parent packages. This is mainly a utility to navigate through npm's *node_modules* directory structure.

```js
getPackageRoot([], 'bean')
// → /absolute/path/to/node_modules/bean/
getPackageRoot([ 'foo', 'bar' ], 'baz')
// → /absolute/path/to/node_modules/foo/node_modules/bar/node_modules/baz/
```

-------------------------

### readPackageJSON(parents, package, callback)
`readPackageJSON()` uses `getPackageRoot()` to locate the *package.json* file for the given package and then return it **modfied for use by Ender**.

Given a standard *package.json* file, the following keys will be replaced if they exist in either the *"ender"* subkey, or the *"overlay"->"ender" sub-subkey:

  * "name"
  * "main"
  * "bridge"
  * "dependencies"
  * "devDependencies"

This allows package owners to provide packages that differ when used in Node and in Ender.

For example, given a *package.json*:

```json
{
  "name": "foo",
  "main": "foo.js",
  "ender": {
    "main": "bar.js",
    "bridge": "ender.js"
  }
}
```

You will actually end up with a structure that looks like this, once processed:

```json
{
  "name": "foo",
  "main": "bar.js",
  "bridge": "ender.js"
}
```

The original, unmolested, deserialized *package.json* structure is available on the prototype of the returned object, e.g.:

```js
readPackageJSON([], 'bean', function (err, packageJSON) {
  var original = Object.getPrototypeOf(packageJSON)
})
```

-------------------------

### getDependenciesFromJSON(packageDescriptor)
`getDependenciesFromJSON()` gets a simple array of dependency package names (not cleaned), from the package descriptor (*package.json*). It will always return an array, even if it's empty.

-------------------------

### getDependenciesFromDirectory(parents, package, callback)
`getDependenciesFromDirectory()` given a package and its parents (in an array, as in `getPackageRoot()`), find a list of dependencies in the *node_modules* directory.

-------------------------

### preparePackagesDirectory(callback)
`preparePackagesDirectory()` is a simple utility to set up *node_modules* if it doesn't already exist. It is necessary for the Ender CLI to make this directory under the current working directory, otherwise npm will search for a *node_modules* directory in the parent directories and use that instead.

-------------------------

## Contributing

Contributions are more than welcome! Just fork and submit a GitHub pull request! If you have changes that need to be synchronized across the various Ender CLI repositories then please make that clear in your pull requests.

### Tests

Ender Package Util uses [Buster](http://busterjs.org) for unit testing. You'll get it (and a bazillion unnecessary dependencies) when you `npm install` in your cloned local repository. Simply run `npm test` to run the test suite.

## Licence

*Ender Package Util* is Copyright (c) 2012 [@rvagg](https://github.com/rvagg), [@ded](https://github.com/ded), [@fat](https://github.com/fat) and other contributors. It is licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.