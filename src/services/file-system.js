const fs = require('fs');
const logger = require('./logging');

module.exports.readFile = path => {
  try {
    const buffer = fs.readFileSync(path);
    return JSON.parse(buffer);
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFile(path, '', err => {
        if (err) logger.error(err);
      });
    }
    return [];
  }
};

module.exports.writeFile = (data, path, cb) => {
  fs.writeFile(path, data, { encoding: 'utf-8' }, cb);
};
