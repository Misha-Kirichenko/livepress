const conn = require("@config/conn");
const { getUserNotificationsGateway } = require("@sockets");
const { notificationUtil } = require("@utils");
const { Op } = require("sequelize");
const { User, UserCategory } = require("@models")(conn);

const userNotificationCacheService = require("@services/userNotificationCacheService");

const handleNewArticleNotification = async (article) => {
	const userNotificationsGateway = getUserNotificationsGateway();

	const categoryUsers = await UserCategory.findAll({
		where: { category_id: article.category_id },
		attributes: ["user_id"]
	});

	/* user ids subscribed on ctg*/
	const userIds = categoryUsers.map((userCategory) => userCategory.user_id);

	const notificationObj = notificationUtil.ARTICLE_NEW(article);

	userNotificationCacheService.addArticleNotif(
		notificationObj,
		userIds
	);

	const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

	const onlineUsers = await User.findAll({
		where: {
			id: userIds,
			lastLogin: { [Op.gte]: fiveMinutesAgo },
			role: "USER"
		},
		attributes: ["id"]
	});

	for (const user of onlineUsers) {
		userNotificationsGateway
			.to(`user-notif-${user.id}`)
			.emit("article:new", notificationObj);
	}
};

module.exports = handleNewArticleNotification;
