const { getUserNotificationsGateway } = require("@sockets");
const { USER } = require("@constants/sockets/events");
const { socketRoomUtil } = require("@utils");
const socketStorageService = require("@services/sockets/socketStorageService");

const handleNotifyUserAboutBlock = (userData) => {
	const { userId, nickName } = userData;
	const userNotificationsGateway = getUserNotificationsGateway();

	userNotificationsGateway
		.to(socketRoomUtil.getUserNotificationRoom(userId))
		.emit(USER.BLOCKED, null);

	socketStorageService.removeUser(userNotificationsGateway.name, nickName);
};

module.exports = handleNotifyUserAboutBlock;
