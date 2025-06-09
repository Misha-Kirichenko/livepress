const { getAdminNotificationsGateway } = require("@sockets");
const adminNotificationCacheService = require("@services/adminNotificationCacheService");
const { ARTICLE } = require("@constants/sockets/events");
const { notificationUtil, socketRoomUtil } = require("@utils");

const handleNotifyAdminAboutReaction = async (
	article,
	userData,
	userReaction
) => {
	const adminNotificationsGateway = getAdminNotificationsGateway();

	const reactionObj = userReaction
		? { type: userReaction, createDate: Date.now() }
		: null;

	const notificationObj = reactionObj
		? notificationUtil.USER_REACTION(userData, reactionObj, article)
		: {
				article_id: article.id,
				message: null,
				user_id: userData.id,
				type: ARTICLE.REACTION
		  };

	const notif_id = await adminNotificationCacheService.addNotif(
		article.author_id,
		notificationObj
	);

	adminNotificationsGateway
		.to(socketRoomUtil.getAdminNotificationRoom(article.author_id))
		.emit(ARTICLE.REACTION, {
			...notificationObj,
			notif_id
		});
};

module.exports = handleNotifyAdminAboutReaction;
