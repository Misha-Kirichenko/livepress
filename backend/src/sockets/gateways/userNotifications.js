const authMiddleware = require("../middlewares/authMiddleware");
const checkSocketRolesMiddleware = require("../middlewares/checkSocketRolesMiddleware");

module.exports = (namespaceInstance) => {
	namespaceInstance.use(authMiddleware);
	namespaceInstance.use(checkSocketRolesMiddleware(["USER"]));
	namespaceInstance.on("connection", (socket) => {
		const roomName = `user-notif-${socket.user.id}`;
		const userFullName = `${socket.user.name} ${socket.user.surname}`;
		console.log(`${userFullName} joined room`, roomName);
		socket.join(roomName);
	});
};
