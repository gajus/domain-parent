# domain-parent 🦾

[![Travis build status](http://img.shields.io/travis/gajus/http-terminator/master.svg?style=flat-square)](https://travis-ci.org/gajus/http-terminator)
[![Coveralls](https://img.shields.io/coveralls/gajus/http-terminator.svg?style=flat-square)](https://coveralls.io/github/gajus/http-terminator)
[![NPM version](http://img.shields.io/npm/v/http-terminator.svg?style=flat-square)](https://www.npmjs.org/package/http-terminator)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Adds a parent Node.js [domain](https://nodejs.org/api/domain.html) reference (`parentDomain` property) to all domains.

{"gitdown": "contents"}

## Motivation

Domains provide a way to add context to a chain of asynchronous calls. Having a reference to the `parentDomain` allows to collect context from all parent domains, e.g.

```js
const findParentDomainNames = () => {
  const parentDomainNames = [];

  let currentDomain = process.domain;

  while (currentDomain && currentDomain.parentDomain) {
    currentDomain = currentDomain.parentDomain;

    parentDomainNames.push(currentDomain.name);
  }

  return parentDomainNames;
};

const main = () => {
  const d0 = domain.create();

  d0.name = 'd0';

  d0.run(() => {
    const d1 = domain.create();

    d1.name = 'd1';

    d1.run(() => {
      const d2 = domain.create();

      d2.name = 'd2';

      d2.run(() => {
        console.log(findParentDomainNames());
      });
    });
  });
};

main();

```

The above prints:

```js
[
  'd1',
  'd0'
]

```

## Implementation

`domain-parent` monkey-patches Node.js [`domain`](https://nodejs.org/api/domain.html) `create` method. All domains that are created after Node.js has been shimmed will have `parentDomain` property. Top-level domain will have `parentDomain` set to `NULL`.

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

### Do not use in distributed packages

Do not shim Node.js in distributable NPM package. If your package depends on `parentDomain`, then:

1. Check if Node.js is shimmed (`require('domain').parentDomain !== undefined`) and warn if Node.js is not shimmed.
2. Document that your package depends on `parentDomain` and provide instructions for adding `domain-parent` shim.
