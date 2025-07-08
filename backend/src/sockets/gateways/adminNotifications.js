const { socketRoomUtil } = require("@utils");
const authMiddleware = require("../middlewares/authMiddleware");
const checkSocketRolesMiddleware = require("../middlewares/checkSocketRolesMiddleware");

module.exports = (namespaceInstance) => {
	namespaceInstance.use(authMiddleware);
	namespaceInstance.use(checkSocketRolesMiddleware(["ADMIN"]));
	namespaceInstance.on("connection", (socket) => {
		const roomName = socketRoomUtil.getAdminNotificationRoom(socket.user.id);
		const adminFullName = `${socket.user.name} ${socket.user.surname}`;
		socket.join(roomName);
		console.log(`${adminFullName} joined room`, roomName);
	});
};
