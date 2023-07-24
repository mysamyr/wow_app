const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
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
app.use(helmet());

app.use(requestLogger);

app.get("/", (req, res) =>
  res.sendFile("./public/single-page.html", {root: __dirname}, (error) => {
    if (error) {
      res.writeHead(500);
      res.end();
    }
  })
);
app.post("/word", validateAddWord, async (req, res) => {
  const word = req.body.word.trim().toLowerCase();
  await db.add(word);
  console.log("Add: " + word);

  return res.status(201).send();
});
app.get("/word", validateGetWord, async (req, res) => {
  const {params} = parseQuery(req.query);
  const words = [];

  const DBCount = await db.count();
  const localDB = require("./src/storage.json");

  // get words from DB (local or cloud)
  const foundWords = (DBCount !== localDB.length)
    ? await db.getAll()
    : localDB;

  for (let length of [...Array(params.length)].map((n, idx) => 3 + idx)) {
    const filteredWords = foundWords.filter(word => word.length === length);
    words.push(...filterWords({words: filteredWords, params, length}));
  }

  // update local DB
  if (DBCount !== localDB.length) {
    const data = JSON.stringify(foundWords.map(({word, length}) => ({word, length})))
    fs.writeFile("./src/storage.json", data, {encoding: "utf-8"}, () => {
      console.log(`Added ${DBCount - localDB.length} words to local DB`);
    });
  }

  return res.status(200).json({
    words,
    length: words.length
  });
});
app.get("/count", validateGetWord, async (req, res) =>
  res.status(200).json({count: await db.count()})
);
app.delete("/word/:word", validateDeleteWord, async (req, res) => {
  const word = req.params.word.trim().toLowerCase();
  await db.delete(word);
  console.log("Delete: " + word);

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
