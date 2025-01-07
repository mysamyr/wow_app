const { timestamp } = require('../utils/time');
const logging = require('../services/logging');

module.exports = (req, res, next) => {
  const start = timestamp();

  res.on('finish', () =>
    logging.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${timestamp() - start}ms`
    )
  );

  next();
};
