const logger = require('./logger');
const tracer = require('./tracer');

module.exports = tracer.wrap('regularFn', () => {
  logger.log('info', 'Running some regular function...');
  return "Regular sync fn!";
});
