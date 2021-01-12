const mongoose = require("mongoose"); // requiring the mongoose package

const todoSchema = new mongoose.Schema({
	// creating a schema for todo
	title: {
		type: String,
		unique: false,
		required: true,
	},
	details: {
		type: String,
		unique: false,
		required: true,
	},
	status: {
		type: Boolean,
		default: false,
	},
});

const todoModel = mongoose.model("Todo", todoSchema); // creating the model from the schema

module.exports = todoModel; // exporting the model
