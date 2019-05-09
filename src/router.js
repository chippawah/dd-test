const express = require('express');

const logger = require('./logger');
const tracer = require('./tracer');
const somePromiseFn = require('./somePromiseFn');

const router = express.Router();

router.get('/ping', (req, res) => {
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
    somePromiseFn()
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

module.exports = router;