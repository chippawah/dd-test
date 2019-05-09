const tracer = require('dd-trace').init({
  hostname: process.env.DD_AGENT_HOST || 'localhost',
  port: process.env.DD_TRACE_AGENT_PORT || 8126,
  service: 'dd-test',
  logInjection: true,
  analytics: true,
});

tracer.use('winston', { enabled: true })

module.exports = tracer;
