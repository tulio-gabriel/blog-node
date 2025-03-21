let db;

if (process.env.NODE_ENV == "production") {
	db = { mongoURI: "mongodb+srv://tgct:<password>@blogapp-db.9lepv.mongodb.net/?retryWrites=true&w=majority&appName=blogapp-db" };
} else {
	db = { mongoURI: "mongodb://localhost/blogapp" };
}

export default db;