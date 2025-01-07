const { Schema, model } = require('mongoose');

const wordSchema = new Schema({
  word: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
});

module.exports = model('Word', wordSchema);
