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
  async find(word) {
    return wordModel.findOne({word});
  },
  async delete(word) {
    return wordModel.deleteOne({word});
  },
};
