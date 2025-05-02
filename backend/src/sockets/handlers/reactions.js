const authMiddleware = require("../middlewares/authMiddleware");

module.exports = (namespaceInstance) => {
	namespaceInstance.use(authMiddleware);
	namespaceInstance.on("connection", (socket) => {
		socket.on("joinArticleRoom", (article_id) => {
			const roomName = `article-${article_id}`;
			const userFullName = `${socket.user.name} ${socket.user.surname}`;
			console.log(`${userFullName} joined room`, roomName);
			socket.join(roomName);
		});
	});
};
