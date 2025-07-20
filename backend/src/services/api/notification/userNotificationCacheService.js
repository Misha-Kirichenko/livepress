const crypto = require("crypto");
const redis = require("@config/redisClient");
const { createRedisKey } = require("@utils");
/* 
example structure for new article notif

user:notif:<notif_id>: {type, message, article_id, createDate, pendingViewers: userIds[]}
user:notifs:<user_id>: [user:notif:369d4f11, user:notif:369d4f11, user:notif:369d4f11]

*/
exports.addNotif = async (notif, user_ids) => {
	const notification = { ...notif };
	const notif_id = crypto.randomBytes(4).toString("hex");
	const userNotifKey = createRedisKey("user:notif", notif_id);

	await redis.set(
		userNotifKey,
		JSON.stringify({ ...notification, pendingViewers: user_ids })
	); //create notification as object {type, message, article_id, createDate, pendingViewers: [userIds]}

	for (const id of user_ids) {
		const userNotifRedisKey = createRedisKey(`user:notifs`, id);
		await redis.lpush(userNotifRedisKey, userNotifKey);
	}

	return notif_id;
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

	const foundNotifIndex = notificationKeysArr.indexOf(notifKey);

	if (foundNotifIndex !== -1) {
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

exports.removeNotifsByArticle = async (user_id, article_id) => {
	const userRedisKey = createRedisKey(`user:notifs`, user_id);
	const notificationKeysArr = await redis.lrange(userRedisKey, 0, -1);
	const rawNotifs = await redis.mget(notificationKeysArr);
	const promises = [];
	for (let i = 0; i < rawNotifs.length; i++) {
		const notif_key = notificationKeysArr[i];
		const parsedNotification = JSON.parse(rawNotifs[i]);
		if (parsedNotification.article_id === article_id) {
			const userIndex = parsedNotification.pendingViewers.indexOf(user_id);
			if (userIndex !== -1) {
				if (parsedNotification.pendingViewers.length === 1) {
					promises.push(redis.del(notif_key));
				} else {
					parsedNotification.pendingViewers.splice(userIndex, 1);
					promises.push(
						redis.set(notif_key, JSON.stringify(parsedNotification))
					);
				}
			}
			promises.push(redis.lrem(userRedisKey, 0, notif_key));
		}
	}

	await Promise.all(promises);
};
