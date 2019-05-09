const winston = require('winston');

module.exports = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  exitOnError: false,
  transports: [
    new winston.transports.Console(),
  ]
});