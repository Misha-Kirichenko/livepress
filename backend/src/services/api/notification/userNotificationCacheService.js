const redis = require("@config/redisClient");
const { createRedisKey } = require("@utils");

exports.addNotif = async (notif, user_ids) => {
	const notification = { ...notif };
	const userNotifKey = createRedisKey("user:notif", notification.notif_id);
	delete notification.notif_id;

	await redis.set(
		userNotifKey,
		JSON.stringify({ ...notification, pendingViewers: user_ids })
	); //create notification as object {type, message, article_id, createDate, pendingViewers: [userIds]}

	for (const id of user_ids) {
		const userNotifRedisKey = createRedisKey(`user:notifs`, id);
		await redis.lpush(userNotifRedisKey, userNotifKey);
	}
	//push notification redis key to array of user notifications
};

exports.getAllUserNotifs = async (user_id) => {
	const userRedisKey = createRedisKey(`user:notifs`, user_id);
	const notificationKeysArr = await redis.lrange(userRedisKey, 0, -1);

	if (!notificationKeysArr.length) return [];

	const rawNotifs = await redis.mget(notificationKeysArr);

	return rawNotifs
		.reduce((acc, curr, i) => {
			if (curr) {
				const parsedCurrNotif = JSON.parse(curr);
				const notif_id = notificationKeysArr[i].split(":").at(-1);
				if (parsedCurrNotif.pendingViewers.includes(user_id)) {
					acc.push({
						notif_id,
						message: parsedCurrNotif.message,
						article_id: parsedCurrNotif.article_id,
						createDate: parsedCurrNotif.createDate,
						type: parsedCurrNotif.type
					});
				}
			}
			return acc;
		}, [])
		.toSorted((a, b) => b.createDate - a.createDate);
};

exports.removeNotif = async (user_id, notif_id) => {
	const userRedisKey = createRedisKey(`user:notifs`, user_id);
	const notificationKeysArr = await redis.lrange(userRedisKey, 0, -1);

	if (!notificationKeysArr.length) return;

	const notifKey = createRedisKey("user:notif", notif_id);

	const articleNotifIndex = notificationKeysArr.indexOf(notifKey);

	if (articleNotifIndex !== -1) {
		const notification = await redis.get(notifKey);
		if (notification) {
			const parsedNotification = JSON.parse(notification);
			const userIndex = parsedNotification.pendingViewers.indexOf(user_id);
			if (userIndex !== -1) {
				if (parsedNotification.pendingViewers.length === 1) {
					await redis.del(notifKey);
					return;
					// If the user is the only pending viewer, delete the notification
				}
				// If the user is not the only pending viewer, remove them from the list
				parsedNotification.pendingViewers.splice(userIndex, 1);
				await redis.set(notifKey, JSON.stringify(parsedNotification));
			}
		}
		await redis.lrem(userRedisKey, 0, notifKey);
	}
};
