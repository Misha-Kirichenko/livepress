const redis = require("@config/redisClient");

const createRedisKey = (keyPrefix, keyValue) => `${keyPrefix}:${keyValue}`;

exports.addArticleNotif = async (notification, userIds) => {
	const articleNotifRedisKey = createRedisKey(
		`article:notif`,
		notification.article_id
	);

	await redis.set(
		articleNotifRedisKey,
		JSON.stringify({ ...notification, pendingViewers: userIds })
	); //create notification as object {message, article_id, createDate, pendingViewers: [userIds]}

	for (const id of userIds) {
		const userNotifRedisKey = createRedisKey(`user:notifs`, id);
		await redis.lpush(userNotifRedisKey, articleNotifRedisKey);
	}
	//push notification redis key to array of user notifications
};

exports.getAllUserNotif = async (userId) => {
	const userRedisKey = createRedisKey(`user:notifs`, userId);
	const notificationKeysArr = await redis.lrange(userRedisKey, 0, -1);

	if (!notificationKeysArr.length) return [];

	const rawNotifs = await redis.mget(notificationKeysArr);
	
	return rawNotifs.reduce((acc, curr) => {
		if (curr) {
			const parsedCurrNotif = JSON.parse(curr);
			delete parsedCurrNotif.pendingViewers;
			acc.push(parsedCurrNotif);
		}
		return acc;
	}, []);
};

exports.removeArticleNotif = async (userId, articleId) => {
	const userRedisKey = createRedisKey(`user:notifs`, userId);
	const notificationKeysArr = await redis.lrange(userRedisKey, 0, -1);

	if (!notificationKeysArr.length) return;

	const articleNotifKey = createRedisKey(`article:notif`, articleId);
	const articleNotifIndex = notificationKeysArr.indexOf(articleNotifKey);

	if (articleNotifIndex !== -1) {
		const notification = await redis.get(articleNotifKey);
		if (notification) {
			const parsedNotification = JSON.parse(notification);
			const userIndex = parsedNotification.pendingViewers.indexOf(userId);
			if (userIndex !== -1) {
				// If the user is the only pending viewer, delete the notification
				if (parsedNotification.pendingViewers.length === 1) {
					await redis.del(articleNotifKey);
					return;
				}
				// If the user is not the only pending viewer, remove them from the list
				parsedNotification.pendingViewers.splice(userIndex, 1);
				await redis.set(articleNotifKey, JSON.stringify(parsedNotification));
			}
		}
		await redis.lrem(userRedisKey, 0, articleNotifKey);
	}
};
