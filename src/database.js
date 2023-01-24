const { Schema, model } = require("mongoose");

const wordSchema = new Schema({
  word: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true
  }
});
const wordModel = model("Word", wordSchema);

module.exports = {
  async add(word) {
    const newWord = await new wordModel({
      word,
      length: word.length
    });
    await newWord.save();
  },
  async getByLength(length) {
    return wordModel.find({length});
  },
  async get(u) {
    if (u.length) {
      const chars = [...new Set(u.split(""))];
      let regex = "(";
      let values = ["а","о","у","е","и","і"];
      const usedVowelChars = values.filter(v => chars.includes(v));
      usedVowelChars.forEach((char, idx) => {
        if (idx === 0) {
          regex += char;
        } else {
          regex += `|${char}`;
        }
      });
      regex += ")";

      return wordModel.find({word: {
          $regex: regex
        }});
    }
    return wordModel.find();
  },
  async find(word) {
    return wordModel.findOne({word});
  },
  async count() {
    return wordModel.count({});
  },
  async delete(word) {
    return wordModel.deleteOne({word});
  },
};
