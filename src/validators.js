const {
  ENTER_WORD,
  MIN_LENGTH,
  MUST_BE_ALPHABET,
  ENTER_LETTERS,
} = require('./constants/error-messages');
const { formatWord } = require('./helpers');
const { BadRequest } = require('./utils/error');

const isAlphabet = word => {
  const alphabet = new Set(process.env.ALPHABET.split(''));
  for (let char of word) {
    if (!alphabet.has(char)) return false;
  }
  return true;
};

module.exports.validateAddWord = async (req, res, next) => {
  const word = formatWord(req.body.word);
  if (!word) throw BadRequest(ENTER_WORD);
  if (!isAlphabet(word)) throw BadRequest(MUST_BE_ALPHABET);
  if (word.length < 3) throw BadRequest(MIN_LENGTH);

  next();
};

module.exports.validateGetWord = async (req, res, next) => {
  if (!req.query.u) throw BadRequest(ENTER_LETTERS);
  if (req.query.u.length < 3) throw BadRequest(MIN_LENGTH);

  next();
};

module.exports.validateDeleteWord = async (req, res, next) => {
  const word = req.params.word;
  if (!word) throw BadRequest(ENTER_WORD);
  if (!isAlphabet(word)) throw BadRequest(MUST_BE_ALPHABET);

  next();
};
