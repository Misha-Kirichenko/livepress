const userNotificationCacheService = require("@services/userNotificationCacheService");

exports.getAllUserNotifications = async (user_id) => {
	const notifications = await userNotificationCacheService.getAllUserNotif(
		user_id
	);

	if (notifications.length) {
		notifications.sort((a, b) => b.createDate - a.createDate);
	}

	return notifications;
};

exports.removeUserNotifications = async (user_id, article_id) => {
	await userNotificationCacheService.removeArticleNotif(user_id, article_id);
};

exports.getAllAdminNotifications = async () => {};
