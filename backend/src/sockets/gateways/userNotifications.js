const { socketRoomUtil } = require("@utils");
const authMiddleware = require("../middlewares/authMiddleware");
const checkSocketRolesMiddleware = require("../middlewares/checkSocketRolesMiddleware");
const socketStorageService = require("@services/sockets/socketStorageService");

module.exports = (namespaceInstance) => {
	namespaceInstance.use(authMiddleware);
	namespaceInstance.use(checkSocketRolesMiddleware(["USER"]));
	namespaceInstance.on("connection", (socket) => {
		socketStorageService.addNewUserSocket(
			namespaceInstance.name,
			socket.user.nickName,
			socket.id
		);
		const roomName = socketRoomUtil.getUserNotificationRoom(socket.user.id);
		const userFullName = `${socket.user.name} ${socket.user.surname}`;
		socket.join(roomName);
		console.log(`${userFullName} joined room`, roomName);

		socket.on("disconnect", () => {
			socketStorageService.removeUserSocket(
				namespaceInstance.name,
				socket.user.id,
				socket.id
			);
		});
	});
};
