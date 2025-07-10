const redis = require("@config/redisClient");
const crypto = require("crypto");
const { createRedisKey } = require("@utils");
const { ARTICLE } = require("@constants/sockets/events");

/*
example structure
{
	"admin:notifs:1": 
	{
		"eca5ba52": {
			message: "string", 
			type: "article:comment:add", 
			user_id: 1,
			createDate: 1752137895924
		}
	}
}

*/
exports.addNotif = async (admin_id, notification) => {
	const adminNotifsKey = createRedisKey(`admin:notifs`, admin_id);
	const allNotifsRaw = await redis.hgetall(adminNotifsKey);
	const { type, user_id, article_id, message } = notification;

	for (const notif_id in allNotifsRaw) {
		const parsedNotif = JSON.parse(allNotifsRaw[notif_id]);
		const foundNotif =
			parsedNotif.user_id === user_id &&
			parsedNotif.article_id === article_id &&
			parsedNotif.type === type &&
			type !== ARTICLE.NEW_COMMENT;
		/*
				Check if type is not "article:comment:new", 
				because one user can comment one article multiple times unlike reacting on article.
				In that case notification doesn't need to be updated, it needs to be added as new
			*/

		if (foundNotif) {
			if (!message) {
				await redis.hdel(adminNotifsKey, notif_id);
			} else {
				await redis.hset(
					adminNotifsKey,
					notif_id,
					JSON.stringify(notification)
				);
			}
			return notif_id;
		}
	}

	const notif_id = crypto.randomBytes(4).toString("hex");
	await redis.hset(adminNotifsKey, notif_id, JSON.stringify(notification));
	return notif_id;
};

exports.getAllAdminNotifs = async (admin_id) => {
	const adminNotifsKey = createRedisKey(`admin:notifs`, admin_id);
	const allNotifsRaw = await redis.hgetall(adminNotifsKey);
	const allNotifs = [];
	for (const notif_id in allNotifsRaw) {
		const parsedNotif = JSON.parse(allNotifsRaw[notif_id]);
		const notifObj = { ...parsedNotif, notif_id };
		allNotifs.push(notifObj);
	}
	return allNotifs;
};

exports.removeNotif = async (admin_id, notif_id) => {
	const adminNotifsKey = createRedisKey(`admin:notifs`, admin_id);
	await redis.hdel(adminNotifsKey, notif_id);
};
