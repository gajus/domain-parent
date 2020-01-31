const domain = require('domain');

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
