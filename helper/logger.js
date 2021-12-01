const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp}) => {
  return `${level} ${message} ${timestamp} `;
});

 
const logger = winston.createLogger({
  level: 'info',
  format: combine(winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
  myFormat, winston.format.colorize()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'access.log' })
  ],
});

module.exports = logger;