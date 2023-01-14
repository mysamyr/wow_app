const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const db = require("./src/database");
const {filterWords, parseQuery} = require("./src/helpers");
const {requestLogger} = require("./src/middlewares");
const {validateAddWord, validateGetWord, validateDeleteWord} = require("./src/validators");

const {
  PORT = 3000,
  MONGODB_URI
} = require("./src/config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: "*"}));

app.use(requestLogger);

app.post("/", validateAddWord, async (req, res) => {
  const word = req.body.word.trim().toLowerCase();
  console.log("Add: " + word);
  await db.add(word);

  return res.status(201).send();
});
app.get("/", validateGetWord, async (req, res) => {
  const {keys, params, length} = parseQuery(req.query);
  const filteredWords = await db.getByLength(length);
  const words = filterWords({
    words: filteredWords,
    keys,
    params,
    length
  });

  return res.status(200).json({
    words,
    length: words.length
  });
});
app.delete("/:word", validateDeleteWord, async (req, res) => {
  const word = req.params.word.trim().toLowerCase();
  console.log("Delete: " + word);
  await db.delete(word);

  return res.status(204).send();
});

(async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
    }, (err) => {
      if (err) console.error("Database error: " + err.message);
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err.message);
  }
})();

/* todo:
  render chars on web
 */