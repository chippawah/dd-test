const Q = require('kew'); // Could also use a native promise instead
const axios = require('axios');
const logger = require('./logger');
const tracer = require('./tracer');

// Using wrap on a synchronous fn
const regularFn = tracer.wrap('regularFn', () => {
  logger.log('info', 'Running some regular function...');
  return "Regular sync fn!";
});

// Both 'test' 'fetcher' are defining a fn and tracing inside of it
const test = () => {
  logger.log('info', 'Running some promise function...');
  const opts = {
    type: 'custom',
    resource: 'tester.js somePromiseFn',
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

const fetcher = () => {
  const opts = {
    resource: 'tester.js fetcher',
  }
  return tracer.trace('fetcher', opts, async (span) => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos/1')
    return data;
  });
}


// Just calling tracer.trace works as well.
tracer.trace('testCall', {}, (span) => {
  return test().then((result) => {
    return fetcher().then((_result) => {
      logger.log('info', result, _result);
      const syncResult = regularFn();
      return syncResult
    });
  })
});
