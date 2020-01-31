// eslint-disable-next-line import/no-commonjs
const domain = require('domain');

// eslint-disable-next-line import/no-commonjs
module.exports = () => {
  if (domain.parentDomain === undefined) {
    const originalCreate = domain.create;

    domain.parentDomain = null;

    domain.create = (...args) => {
      const parentDomain = process.domain || null;

      const nextDomain = originalCreate(...args);

      nextDomain.parentDomain = parentDomain;

      return nextDomain;
    };
  }
};
