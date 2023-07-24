const fs = require("fs");

module.exports.log = (message) => {
	// eslint-disable-next-line no-console
	console.log(message);
};

module.exports.error = (message) => {
	// eslint-disable-next-line no-console
	console.error(message);
};

module.exports.readFile = (path) => {
	try {
		const buffer = fs.readFileSync(path);
		return JSON.parse(buffer);
	} catch (err) {
		if (err.code === "ENOENT") {
			fs.writeFile(path, "", (err) => {
				if (err) module.exports.error(err);
			});
		}
		return [];
	}
};
