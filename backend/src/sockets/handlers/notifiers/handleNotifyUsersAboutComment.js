const conn = require("@config/conn");
const { Op } = require("sequelize");
const { getUserNotificationsGateway } = require("@sockets");
const { userNotificationCacheService } = require("@services/api/notification");
const { UserCategory } = require("@models")(conn);
const { ARTICLE } = require("@constants/sockets/events");
const socketStorageService = require("@services/sockets/socketStorageService");
const { notificationUtil, socketRoomUtil } = require("@utils");

const handleNotifyUsersAboutComment = async (userData, commentData) => {
	const userNotificationsGateway = getUserNotificationsGateway();
	const notificationObj = notificationUtil.NEW_COMMENT(userData, commentData);

	const categoryUsers = await UserCategory.findAll({
		where: {
			category_id: commentData.article_category_id,
			user_id: { [Op.ne]: userData.id }
		},
		attributes: ["user_id"]
	});

	const userIds = categoryUsers.map((userCategory) => userCategory.user_id);

	const notif_id = await userNotificationCacheService.addNotif(
		notificationObj,
		userIds
	);

	const userSockets = socketStorageService.getUserSockets(
		userNotificationsGateway.name,
		userData.nickName
	);

	for (const id of userIds) {
		userNotificationsGateway
			.to(socketRoomUtil.getUserNotificationRoom(id))
			.except(userSockets)
			.emit(ARTICLE.NEW_COMMENT, { notif_id, ...notificationObj });
	}
};

module.exports = handleNotifyUsersAboutComment;
