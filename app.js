// Required Headers
const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./models/db.js");
const cookieParser = require("cookie-parser");

// Google OAuth Requirements
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
	"75646130708-772esiok840kl9enq2mgqeok7evif2qm.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.set("view engine", "ejs");

// Verification at login endpoint
app.get("/login", (req, res) => {
	res.render("login");
	let token = req.body.token;
	res.send(token);
});

app.post("/login", (req, res) => {
	let token = req.body.token;

	async function verify() {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
		});
		const payload = ticket.getPayload();
		const userid = payload["sub"];
		// console.log(token);
	}
	verify()
		.then(() => {
			res.cookie("session-token", token);
			res.send("success");
		})
		.catch(console.error);
});

function checkAuthenticated(req, res, next) {
	let token = req.cookies["session-token"];

	let user = {};
	async function verify() {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
		});
		const payload = ticket.getPayload();
		user.name = payload.name;
		user.email = payload.email;
		user.picture = payload.picture;
	}
	verify()
		.then(() => {
			req.user = user;
			next();
		})
		.catch((err) => {
			res.redirect("/login");
		});
}

// Payload check
function success(res, payload) {
	return res.status(200).json(payload);
}

// Operation for the TODO app
app.get("/todos", async (req, res, next) => {
	try {
		const todos = await db.Todo.find({});
		return success(res, todos);
	} catch (err) {
		next({ status: 400, message: "failed to get todos" });
	}
});

app.post("/todos", async (req, res, next) => {
	try {
		const todo = await db.Todo.create(req.body);
		return success(res, todo);
	} catch (err) {
		next({ status: 400, message: err });
	}
});

app.put("/todos/:id", async (req, res, next) => {
	try {
		const todo = await db.Todo.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		return success(res, todo);
	} catch (err) {
		next({ status: 400, message: "failed to update todo" });
	}
});
app.delete("/todos/:id", async (req, res, next) => {
	try {
		await db.Todo.findByIdAndRemove(req.params.id);
		return success(res, "todo deleted!");
	} catch (err) {
		next({ status: 400, message: "failed to delete todo" });
	}
});

// Error listener
app.use((err, req, res, next) => {
	return res.status(err.status || 400).json({
		status: err.status || 400,
		message: err.message || "there was an error processing request",
	});
});

// Listening to port
app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
