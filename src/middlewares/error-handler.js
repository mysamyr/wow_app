const STATUS_CODES = require('../constants/status-codes');
const logger = require('../services/logging');
const ApiError = require('../utils/error');

module.exports = (err, req, res, next) => {
  if (!err) {
    return res.status(STATUS_CODES.NOT_FOUND).send();
  }
  if (err instanceof ApiError) {
    logger.error(err);
    return res.status(err.status).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: 'Element already exists' });
  }
  logger.error(err);
  return res
    .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
    .json({ message: 'Unexpected error' });
};
