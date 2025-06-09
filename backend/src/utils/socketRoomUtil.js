const socketRoomUtil = {
	getUserNotificationRoom: (userId) => `user-notif-${userId}`,
	getAdminNotificationRoom: (adminId) => `admin-notif-${adminId}`,
	getArticleRoom: (articleId) => `article-${articleId}`
};

module.exports = socketRoomUtil;
