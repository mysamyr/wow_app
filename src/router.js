const Router = require('express');
const { INTERNAL_ERROR } = require('./constants/status-codes');
const promisify = require('./middlewares/promisify');
const {
  validateAddWord,
  validateGetWord,
  validateDeleteWord,
} = require('./validators');
const { addWord, getWords, countWords, deleteWord } = require('./controller');

const router = Router();

router.get('/', (req, res) =>
  res.sendFile('./public/index.html', { root: process.cwd() }, error => {
    if (error) {
      res.writeHead(INTERNAL_ERROR);
      res.end();
    }
  })
);

router.post('/word', validateAddWord, promisify(addWord));

router.get('/word', validateGetWord, promisify(getWords));

router.get('/count', promisify(countWords));

router.delete('/word/:word', validateDeleteWord, promisify(deleteWord));

module.exports = router;
