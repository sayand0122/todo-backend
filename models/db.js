require("dotenv").config();
const mongoose = require("mongoose");
mongoose
	.connect(process.env.DB_URL, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log(`DB Connected`);
	});
mongoose.set("debug", true); // enabling debugging information to be printed to the console for debugging purposes
mongoose.Promise = Promise; // setting mongoose's Promise to use Node's Promise

module.exports.Todo = require("./todo"); // requiring the todo model that we just created in mongodb
