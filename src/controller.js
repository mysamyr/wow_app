const { CREATED, OK, NO_CONTENT } = require('./constants/status-codes');
const {
  WORD_DOESNT_EXIST,
  ALREADY_ADDED,
} = require('./constants/error-messages');
const Word = require('./services/database');
const { formatWord, parseQuery, filterWords } = require('./helpers');
const logger = require('./services/logging');
const { readFile, writeFile } = require('./services/file-system');
const { BadRequest } = require('./utils/error');

module.exports.addWord = async (req, res) => {
  const exist = await Word.findOne({ word: req.body.word });
  if (exist) throw BadRequest(ALREADY_ADDED);
  const word = formatWord(req.body.word);
  await Word.create({
    word,
    length: word.length,
  });
  logger.info('Added: ' + word);

  return res.status(CREATED).send();
};

module.exports.getWords = async (req, res) => {
  const { params } = parseQuery(req.query);
  const words = [];

  const DBCount = await Word.countDocuments().exec();
  const localDB = readFile('./storage.json');

  const useExternalDb = DBCount !== localDB.length;

  // get words from DB (local or cloud)
  const foundWords = useExternalDb ? await Word.find().exec() : localDB;

  for (let length of [...Array(params.length)].map((n, idx) => 3 + idx)) {
    const filteredWords = foundWords.filter(word => word.length === length);
    words.push(...filterWords({ words: filteredWords, params, length }));
  }

  // update local DB
  if (useExternalDb) {
    writeFile(
      JSON.stringify(
        foundWords.map(({ word, length }) => ({ word, length })),
        null,
        2
      ),
      './storage.json',
      () => logger.info(`Added ${DBCount - localDB.length} words to local DB`)
    );
  }

  return res.status(OK).json({
    words,
    length: words.length,
  });
};

module.exports.countWords = async (req, res) => {
  const count = await Word.countDocuments().exec();
  return res.status(OK).json({ count });
};

module.exports.deleteWord = async (req, res) => {
  const word = formatWord(req.params.word);
  const { deletedCount } = await Word.deleteOne({ word });
  if (!deletedCount) {
    throw BadRequest(WORD_DOESNT_EXIST);
  }

  logger.info('Deleted: ' + word);
  return res.status(NO_CONTENT).send();
};
