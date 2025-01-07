const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
  level: 'http',
  format: format.combine(
    format.errors({ stack: true }),
    format.colorize(),
    format.timestamp(),
    format.printf(info => {
      if (info instanceof Error) {
        return `${info.timestamp} ${info.level}: ${info.message} ${info.stack || ''}`;
      }
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  ),
  transports: [new transports.Console()],
});
