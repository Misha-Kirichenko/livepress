const { ARTICLE } = require("@constants/sockets/events");
const { socketRoomUtil } = require("@utils");
const authMiddleware = require("../middlewares/authMiddleware");

module.exports = (namespaceInstance) => {
	namespaceInstance.use(authMiddleware);
	namespaceInstance.on("connection", (socket) => {
		socket.on(ARTICLE.VISIT, (article_id) => {
			const roomName = socketRoomUtil.getArticleRoom(article_id);
			const userFullName = `${socket.user.name} ${socket.user.surname}`;
			console.log(`${userFullName} joined room`, roomName);
			socket.join(roomName);
		});
	});
};
