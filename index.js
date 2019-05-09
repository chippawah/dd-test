const { config } = require('dotenv');

config();

const tracer = require('dd-trace').init({
  hostname: process.env.DD_AGENT_HOST || 'localhost',
  port: process.env.DD_TRACE_AGENT_PORT || 8126,
  service: 'dd-test',
  logInjection: true,
  analytics: true,
});

tracer.use('winston', { enabled: true })

const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  exitOnError: false,
  transports: [
    new winston.transports.Console(),
  ]
})
const express = require('express');
const winstonMiddleware = require('express-winston');
const Q = require('kew');
const ddConnect = require('connect-datadog');
const bodyParser = require('body-parser');

const someFn = () => {
  logger.log('info', 'Running some function...');
  const opts = {
    type: 'custom',
    resource: 'dd-test someFn.js',
    tags: {
      'checkCheck': '1'
    },
  }
  return tracer.trace('someFn', opts, async (span) => {
    span.finish();
    const dfd = Q.defer();
    setTimeout(() => {
      dfd.resolve('someFn');
    }, 50)
    const result = await dfd.promise;
    return result;
  });
};


app = express();

app.use(bodyParser.json());

app.use(winstonMiddleware.logger({ winstonInstance: logger }));

app.get('/ping', (req, res) => {
  const opts = {
    tags: {
      'http.url': req.url,
      'http.method': 'GET',
    },
    type: 'web',
    resource: 'dd-test GET /ping'
  }
  logger.log('info', 'received ping... sending PONG');
  tracer.trace('ping', opts, (span) => {
    someFn()
      .then((result) => {
        res
          .status(200)
          .json({
            message: 'PONG',
            result,
          });
      })
      .catch((err) => {
        logger.log('info', err)
        res
          .status(500)
          .send('whoosh');
      })
  });
});

app.use(ddConnect({
  response_code: true,
  env: process.env.NODE_ENV || 'local',
  tags: [
    'app:express_test'
  ],
}));

const port = process.env.PORT || 3000;

const server = app.listen(port, (err) => {
  if (err) {
    logger.log('info', 'Error starting server', err);
  } else {
    logger.log('info', `Listening on port: ${port}`);
  }
});