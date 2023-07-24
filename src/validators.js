const db = require("./database");
const { BAD_REQUEST } = require("./constants/status-codes");
const {
	ENTER_WORD,
	MIN_LENGTH,
	ALREADY_ADDED,
	MUST_BE_ALPHABET,
	ENTER_LETTERS,
} = require("./constants/error-messages");
const { ALPHABET } = require("./config");
const { formatWord } = require("./helpers");

const isAlphabet = (word) => {
	const alphabet = new Set(ALPHABET.split(""));
	for (let char of word) {
		if (!alphabet.has(char)) return false;
	}
	return true;
};

module.exports.validateAddWord = async (req, res, next) => {
	const word = formatWord(req.body.word);
	if (!word)
		return res.status(BAD_REQUEST).json({
			message: ENTER_WORD,
		});
	if (!isAlphabet(word))
		return res.status(BAD_REQUEST).json({
			message: MUST_BE_ALPHABET,
		});
	if (word.length < 3)
		return res.status(BAD_REQUEST).json({
			message: MIN_LENGTH,
		});
	const exist = await db.find(req.body.word);
	if (exist)
		return res.status(BAD_REQUEST).json({
			message: ALREADY_ADDED,
		});

	next();
};

module.exports.validateGetWord = async (req, res, next) => {
	if (!req.query.u)
		return res.status(BAD_REQUEST).json({
			message: ENTER_LETTERS,
		});
	if (req.query.u.length < 3)
		return res.status(BAD_REQUEST).json({
			message: MIN_LENGTH,
		});

	next();
};

module.exports.validateDeleteWord = async (req, res, next) => {
	const word = req.params.word;
	if (!word)
		return res.status(BAD_REQUEST).json({
			message: ENTER_WORD,
		});
	if (!isAlphabet(word))
		return res.status(BAD_REQUEST).json({
			message: MUST_BE_ALPHABET,
		});

	next();
};
