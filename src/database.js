const { Schema, model } = require("mongoose");

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
const wordModel = model("Word", wordSchema);

module.exports = {
	async add(word) {
		const newWord = await new wordModel({
			word,
			length: word.length,
		});
		await newWord.save();
	},
	async getAll() {
		return wordModel.find();
	},
	async find(word) {
		return wordModel.findOne({ word });
	},
	async count() {
		return wordModel.count({});
	},
	async delete(word) {
		return wordModel.deleteOne({ word });
	},
};
