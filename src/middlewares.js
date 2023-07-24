const { log } = require("./services");

module.exports.requestLogger = (req, res, next) => {
	const info = {
		url: decodeURI(req.url),
		method: req.method,
		timestamp: new Date().toISOString(),
	};

	if (!["GET", "DELETE"].includes(req.method)) {
		info.body = req.body;
	}
	log(JSON.stringify(info));

	next();
};
