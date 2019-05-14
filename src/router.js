const express = require('express');

const logger = require('./logger');
const tracer = require('./tracer');
const somePromiseFn = require('./somePromiseFn');
const regularFn = require('./regularFn');

const router = express.Router();

router.get('/somePromiseFn', (req, res) => {
  const opts = {
    tags: {
      'http.url': req.url,
      'http.method': 'GET',
    },
    type: 'web',
    resource: 'dd-test GET /somePromiseFn'
  }
  logger.log('info', 'Calling promise fn');
  return tracer.trace('somePromiseFn', opts, (span) => {
    return somePromiseFn()
      .then((result) => {
        return res
          .status(200)
          .json({
            message: 'PONG',
            result,
          });
      })
      .catch((err) => {
        logger.log('info', err)
        return res
          .status(500)
          .send('whoosh');
      })
  });
});

router.get('/regularFn', (req, res) => {
  const opts = {
    tags: {
      'http.url': req.url,
      'http.method': 'GET',
    },
    type: 'web',
    resource: 'dd-test GET /regularFn'
  }
  logger.log('info', 'Calling regular fn');
  return tracer.trace('regularFn', opts, (span) => {
    const result = regularFn();
    return res
        .status(200)
        .json({
            result,
            message: 'RegularFn was called!'
        });
  });
});

module.exports = router;