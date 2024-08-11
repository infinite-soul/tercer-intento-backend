// utils/logger.js
import winston from 'winston';

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  }
};

winston.addColors({
  fatal: 'red',
  error: 'red',
  warning: 'yellow',
  info: 'blue',
  http: 'green',
  debug: 'white'
});

const developmentLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      level: 'debug'
    })
  ]
});

const productionLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({
      level: 'info'
    }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error'
    })
  ]
});

const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

export default logger;