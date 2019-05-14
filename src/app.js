const express = require('express');
const winstonMiddleware = require('express-winston');
const bodyParser = require('body-parser');

const logger = require('./logger');
const router = require('./router');

const app = express();

app.use(bodyParser.json());
app.use(winstonMiddleware.logger({ winstonInstance: logger }));
app.use(ddConnect({
  response_code: true,
  env: process.env.NODE_ENV || 'local',
  tags: [
    'dd-test:express'
  ],
}));

app.use(router);

module.exports = app;