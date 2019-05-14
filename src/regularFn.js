const logger = require('./logger');
const tracer = require('./tracer');

const span = tracer.startSpan('regularFn');


module.exports = tracer.scope().bind(() => {
  logger.log('info', 'Running some promise function...');
  return "Regular sync fn!";
}, span);
