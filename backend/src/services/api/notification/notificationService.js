const userNotificationCacheService = require("./userNotificationCacheService");
const adminNotificationCacheService = require("./adminNotificationCacheService");

exports.getAllUserNotifications = async (user_id) => {
	const notifications = await userNotificationCacheService.getAllUserNotifs(
		user_id
	);
	return notifications;
};

exports.removeUserNotification = async (user_id, notif_id) => {
	await userNotificationCacheService.removeNotif(user_id, notif_id);
};

exports.removeUserNotificationByArticle = async (user_id, article_id) => {
	await userNotificationCacheService.removeNotifsByArticle(user_id, Number(article_id));
};

exports.getAllAdminNotifications = async (admin_id) => {
	const notifications = await adminNotificationCacheService.getAllAdminNotifs(
		admin_id
	);
	return notifications;
};

exports.removeAdminNotification = async (admin_id, notif_id) => {
	await adminNotificationCacheService.removeNotif(admin_id, notif_id);
};

exports.removeAdminNotificationByArticle = async (admin_id, article_id) => {
	await adminNotificationCacheService.removeNotifsByArticle(
		admin_id,
		Number(article_id)
	);
};
