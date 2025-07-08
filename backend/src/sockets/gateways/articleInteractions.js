const { ARTICLE } = require("@constants/sockets/events");
const { socketRoomUtil } = require("@utils");
const authMiddleware = require("../middlewares/authMiddleware");
const socketStorageService = require("@services/sockets/socketStorageService");

module.exports = (namespaceInstance) => {
	namespaceInstance.use(authMiddleware);
	namespaceInstance.on("connection", (socket) => {
		socketStorageService.addNewUserSocket(
			namespaceInstance.name,
			socket.user.nickName,
			socket.id
		);
		socket.on(ARTICLE.VISIT, (article_id) => {
			const roomName = socketRoomUtil.getArticleRoom(article_id);
			const userFullName = `${socket.user.name} ${socket.user.surname}`;
			socket.join(roomName);
			console.log(`${userFullName} joined room`, roomName);
		});

		socket.on("disconnect", () => {
			socketStorageService.removeUserSocket(
				namespaceInstance.name,
				socket.user.nickName,
				socket.id
			);
		});
	});
};
