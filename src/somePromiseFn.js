const Q = require('kew'); // Could also use a native promise instead
const logger = require('./logger');
const tracer = require('./tracer');

module.exports = () => {
  logger.log('info', 'Running some promise function...');
  const opts = {
    type: 'custom',
    resource: 'dd-test somePromiseFn.js',
    tags: {
      'foo': 'bar'
    },
  }
  return tracer.trace('somePromiseFn', opts, async (span) => {
    span.finish();
    const dfd = Q.defer();
    setTimeout(() => {
      dfd.resolve('somePromiseFn');
    }, 50)
    const result = await dfd.promise;
    return result;
  });
};
