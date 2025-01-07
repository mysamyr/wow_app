require('./utils/dotenv');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./services/logging');
const requestLogger = require('./middlewares/request-logger');
const errorHandler = require('./middlewares/error-handler');
const STATUS_CODES = require('./constants/status-codes');

const PORT = +process.env.PORT;
const REQUEST_TIMEOUT = +process.env.REQUEST_TIMEOUT || 5000;
const HEADERS_TIMEOUT = +process.env.HEADERS_TIMEOUT || 2000;
const KEEP_ALIVE_TIMEOUT = +process.env.KEEP_ALIVE_TIMEOUT || 3000;
const SERVER_TIMEOUT = +process.env.SERVER_TIMEOUT || 60000;

const app = express();

app.enable('trust proxy');
app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(compression());
app.use(requestLogger);

app.get('/ping', (req, res) => res.status(STATUS_CODES.OK).send());

app.use(require('./router'));

app.use(errorHandler);

const start = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_DB_NAME,
    });
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    server.requestTimeout = REQUEST_TIMEOUT;
    server.headersTimeout = HEADERS_TIMEOUT;
    server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT;
    server.setTimeout(SERVER_TIMEOUT);
  } catch (err) {
    logger.error(err);
  }
};

start();

process
  .on('unhandledRejection', err => {
    logger.error(err);
  })
  .on('uncaughtException', async err => {
    logger.error(err);
    logger.error('!= () APP shutdown ');
    await mongoose.disconnect();
    process.exit(1);
  })
  .on('SIGINT', async () => {
    logger.warn('Received SIGINT. Closing connections...');
    await mongoose.disconnect();
    process.exit(0);
  })
  .on('SIGTERM', async () => {
    logger.warn('Received SIGTERM. Closing connections...');
    await mongoose.disconnect();
    process.exit(0);
  });
