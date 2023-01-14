module.exports.requestLogger = (req, res, next) => {
  console.log(JSON.stringify({
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString(),
  }));

  next();
};