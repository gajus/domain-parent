<a name="domain-parent"></a>
# domain-parent 👪

[![Travis build status](http://img.shields.io/travis/gajus/domain-parent/master.svg?style=flat-square)](https://travis-ci.org/gajus/domain-parent)
[![Coveralls](https://img.shields.io/coveralls/gajus/domain-parent.svg?style=flat-square)](https://coveralls.io/github/gajus/domain-parent)
[![NPM version](http://img.shields.io/npm/v/domain-parent.svg?style=flat-square)](https://www.npmjs.org/package/domain-parent)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Adds a parent Node.js [domain](https://nodejs.org/api/domain.html) reference (`parentDomain` property) to all domains.

* [domain-parent 👪](#domain-parent)
    * [Motivation](#domain-parent-motivation)
    * [Implementation](#domain-parent-implementation)
    * [Usage](#domain-parent-usage)
        * [Do not use in distributed packages](#domain-parent-usage-do-not-use-in-distributed-packages)


<a name="domain-parent-motivation"></a>
## Motivation

Domains provide a way to add context to a chain of asynchronous calls. Having a reference to the `parentDomain` allows to collect context from all parent domains.

[Roarr](https://github.com/gajus/roarr#roarr-api-adopt) logger demonstrates how `parentDomain` can be used to create comprehensive logs.

<a name="domain-parent-implementation"></a>
## Implementation

`domain-parent` monkey-patches Node.js [`domain`](https://nodejs.org/api/domain.html) `create` method. All domains that are created after Node.js has been shimmed will have `parentDomain` property. Top-level domain will have `parentDomain` set to `NULL`.

<a name="domain-parent-usage"></a>
## Usage

To shim Node.js, import `domain-parent/auto`, e.g.

```js
import 'domain-parent/auto';
import domain from 'domain';

domain.parentDomain === null;

const d0 = domain.create();

d0.run(() => {
  process.domain.parentDomain === null;

  const d1 = domain.create();

  d1.run(() => {
    process.domain.parentDomain === d0;
  });
});

```

<a name="domain-parent-usage-do-not-use-in-distributed-packages"></a>
### Do not use in distributed packages

Do not shim Node.js in distributable NPM package. If your package depends on `parentDomain`, then:

1. Check if Node.js is shimmed (`require('domain').parentDomain !== undefined`) and warn if Node.js is not shimmed.
2. Document that your package depends on `parentDomain` and provide instructions for adding `domain-parent` shim.
