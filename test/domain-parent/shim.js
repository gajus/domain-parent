// @flow

/* eslint-disable fp/no-delete */

import domain from 'domain';
import test, {
  beforeEach,
} from 'ava';
import shim from '../../src/shim';

const originalCreate = domain.create;

beforeEach(() => {
  // $FlowFixMe
  domain.create = originalCreate;

  // $FlowFixMe
  delete domain.parentDomain;
});

test('adds `parentDomain` to the top-level domain', (t) => {
  // $FlowFixMe
  t.is(domain.parentDomain, undefined);

  shim();

  // $FlowFixMe
  t.is(domain.parentDomain, null);
});

test.only('adds `parentDomain` created domains', (t) => {
  shim();

  const d0 = domain.create();

  d0.run(() => {
    // $FlowFixMe
    t.is(process.domain.parentDomain, null);

    const d1 = domain.create();

    d1.run(() => {
      // $FlowFixMe
      t.is(process.domain.parentDomain, d0);

      const d2 = domain.create();

      d2.run(() => {
        // $FlowFixMe
        t.is(process.domain.parentDomain, d1);
      });
    });
  });
});
