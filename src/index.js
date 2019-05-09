const { config } = require('dotenv');

config();

const tracer = require('./tracer');

const logger = require('./logger');
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) {
    logger.log('info', 'Error starting server', err);
  } else {
    logger.log('info', `Listening on port: ${port}`);
  }
});