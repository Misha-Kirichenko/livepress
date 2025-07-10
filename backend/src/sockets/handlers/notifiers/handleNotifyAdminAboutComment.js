const { getAdminNotificationsGateway } = require("@sockets");
const { adminNotificationCacheService } = require("@services/api/notification");
const { ARTICLE } = require("@constants/sockets/events");
const { notificationUtil, socketRoomUtil } = require("@utils");

const handleNotifyAdminAboutComment = async (userData, commentData) => {
	const adminNotificationsGateway = getAdminNotificationsGateway();

	const notificationObj = notificationUtil.NEW_COMMENT(userData, commentData);

	const notif_id = await adminNotificationCacheService.addNotif(
		commentData.article_author_id,
		notificationObj
	);

	adminNotificationsGateway
		.to(socketRoomUtil.getAdminNotificationRoom(commentData.article_author_id))
		.emit(ARTICLE.NEW_COMMENT, {
			...notificationObj,
			notif_id
		});
};

module.exports = handleNotifyAdminAboutComment;
