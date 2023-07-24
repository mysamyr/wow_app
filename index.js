const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const db = require("./src/database");
const {
	CREATED,
	OK,
	BAD_REQUEST,
	DELETED,
	INTERNAL_ERROR,
} = require("./src/constants/status-codes");
const { WORD_DOESNT_EXIST } = require("./src/constants/error-messages");
const { filterWords, parseQuery, formatWord } = require("./src/helpers");
const { log, error, readFile } = require("./src/services");
const { requestLogger } = require("./src/middlewares");
const {
	validateAddWord,
	validateGetWord,
	validateDeleteWord,
} = require("./src/validators");

const { PORT = 3000, MONGODB_URI } = require("./src/config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({ origin: "*" }));
app.use(helmet());

app.use(requestLogger);

app.get("/", (req, res) =>
	res.sendFile("./public/index.html", { root: __dirname }, (error) => {
		if (error) {
			res.writeHead(INTERNAL_ERROR);
			res.end();
		}
	}),
);
app.post("/word", validateAddWord, async (req, res) => {
	const word = formatWord(req.body.word);
	await db.add(word);
	log("Add: " + word);

	return res.status(CREATED).send();
});
app.get("/word", validateGetWord, async (req, res) => {
	const { params } = parseQuery(req.query);
	const words = [];

	const DBCount = await db.count();
	const localDB = readFile("./src/storage.json");

	// get words from DB (local or cloud)
	const foundWords = DBCount !== localDB.length ? await db.getAll() : localDB;

	for (let length of [...Array(params.length)].map((n, idx) => 3 + idx)) {
		const filteredWords = foundWords.filter((word) => word.length === length);
		words.push(...filterWords({ words: filteredWords, params, length }));
	}

	// update local DB
	if (DBCount !== localDB.length) {
		const data = JSON.stringify(
			foundWords.map(({ word, length }) => ({ word, length })),
		);
		fs.writeFile("./src/storage.json", data, { encoding: "utf-8" }, () => {
			log(`Added ${DBCount - localDB.length} words to local DB`);
		});
	}

	return res.status(OK).json({
		words,
		length: words.length,
	});
});
app.get("/count", async (req, res) =>
	res.status(OK).json({ count: await db.count() }),
);
app.delete("/word/:word", validateDeleteWord, async (req, res) => {
	const word = formatWord(req.params.word);
	const { deletedCount } = await db.delete(word);
	if (!deletedCount) {
		return res.status(BAD_REQUEST).json({ message: WORD_DOESNT_EXIST });
	}

	log("Delete: " + word);
	return res.status(DELETED).send();
});

try {
	mongoose.connect(MONGODB_URI);
	app.listen(PORT, () => {
		log(`Server is running on port ${PORT}`);
	});
} catch (err) {
	error(err.message);
}
