require("dotenv").config();
require("module-alias/register");
const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const router = require("./router");
const conn = require("@config/conn");
const connectDB = require("@config/connectDB");
const { setupSocketNamespaces } = require("@sockets");
const CORS_SETTINGS = require("@config/corsSettings");
const tasksArray = require("@services/cron");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: CORS_SETTINGS
});

connectDB(conn);

app.use(cors(CORS_SETTINGS));
app.use(express.json());

app.use(
	"/user_uploads",
	express.static(path.join(__dirname, "..", "user_uploads"))
);

app.use("/api", router);

setupSocketNamespaces(io);

tasksArray.forEach((task) => task.start());

server.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
