const conn = require("@config/conn");
const { getUserNotificationsGateway } = require("@sockets");
const { notificationUtil, socketRoomUtil } = require("@utils");
const { UserCategory } = require("@models")(conn);
const { ARTICLE } = require("@constants/sockets/events");
const { userNotificationCacheService } = require("@services/api/notification");

const handleNewArticleNotification = async (article) => {
	const userNotificationsGateway = getUserNotificationsGateway();

	const categoryUsers = await UserCategory.findAll({
		where: { category_id: article.category_id },
		attributes: ["user_id"]
	});

	/* user ids subscribed on ctg*/
	const userIds = categoryUsers.map((userCategory) => userCategory.user_id);

	const notificationObj = notificationUtil.ARTICLE_NEW(article);

	const notif_id = userNotificationCacheService.addNotif(
		notificationObj,
		userIds
	);

	for (const id of userIds) {
		userNotificationsGateway
			.to(socketRoomUtil.getUserNotificationRoom(id))
			.emit(ARTICLE.NEW, { notif_id, ...notificationObj });
	}
};

module.exports = handleNewArticleNotification;
